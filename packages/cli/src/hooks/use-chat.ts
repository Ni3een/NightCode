import { useState, useRef, useCallback, useEffect } from "react";
import { EventSourceParserStream } from "eventsource-parser/stream";
import type { ClientResponse } from "hono/client";
import prettyMs from "pretty-ms";
import { apiClient } from "../lib/api-client";
import { getErrorMessage } from "../lib/http-error";
import type { Mode } from "@nightcode/shared";
import { chatStreamEventSchema } from "@nightcode/shared";
import type { SupportedChatModelId } from "@nightcode/shared";

export type ClientMessagePart = { type: "text"; text: string };

export type Message =
  | { 
      id: string;
      role: "user";
      content: string;
      mode: Mode;
      model: SupportedChatModelId
    }
  | {
      id: string;
      role: "assistant";
      content: string;
      mode: Mode;
      model: SupportedChatModelId;
      parts: ClientMessagePart[];
      duration?: string;
      interrupted?: boolean;
    }
  | { id: string; role: "error"; content: string };

type StreamingState =
  | { status: "idle" }
  | { 
      status: "streaming";
      parts: ClientMessagePart[];
      mode: Mode;
      model: SupportedChatModelId
    };

type ActiveStream = {
  requestId: string;
  controller: AbortController;
  mode: Mode;
  model: SupportedChatModelId;
  parts: ClientMessagePart[];
  interruptedCaptured: boolean;
};

type SubmitParams = {
  userText: string;
  mode: Mode;
  model: SupportedChatModelId;
};

type RunStreamParams = {
  mode: Mode;
  model: SupportedChatModelId;
  request: (controller: AbortController) => Promise<ClientResponse<unknown>>;
};

export function useChat(
  sessionId: string,
  initialMessages: Message[],
) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [streaming, setStreaming] = useState<StreamingState>({
    status: "idle"
  });
  const activeStreamRef = useRef<ActiveStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const activeStream = activeStreamRef.current;
      if (activeStream) {
        activeStream.controller.abort();
        activeStreamRef.current = null;
      }
    };
  }, []);

  const updateMessages = useCallback((updater: (prev: Message[]) => Message[]) => {
    setMessages((prev) => updater(prev));
  }, []);

  const isActiveRequest = useCallback((requestId: string) => {
    return activeStreamRef.current?.requestId === requestId;
  }, []);

  const emitParts = useCallback((
    requestId: string,
    parts: ClientMessagePart[],
  ) => {
    if (!isActiveRequest(requestId)) return;

    const snapshot = [...parts];
    const activeStream = activeStreamRef.current;
    if (!activeStream) return;

    activeStream.parts = snapshot;
    setStreaming({
      status: "streaming",
      parts: snapshot,
      mode: activeStream.mode,
      model: activeStream.model,
    });
  }, [isActiveRequest]);

  const captureInterruptedMessage = useCallback((
    activeStream: ActiveStream
  ) => {
    if (
      activeStream.interruptedCaptured ||
      activeStream.parts.length === 0
    ) {
      return;
    }

    activeStream.interruptedCaptured = true;
    const parts = [...activeStream.parts];
    const fullText = parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

    updateMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: fullText,
        mode: activeStream.mode,
        model: activeStream.model,
        parts,
        interrupted: true,
      },
    ]);
  }, [updateMessages]);

  const clearStream = useCallback(
    (requestId: string) => {
      if (!isActiveRequest(requestId)) return;

      activeStreamRef.current = null;
      setStreaming({ status: "idle" });
    },
    [isActiveRequest],
  );

  const handleStream = useCallback(async (
    response: ClientResponse<unknown>,
    activeStream: ActiveStream
  ) => {
    if (!isActiveRequest(activeStream.requestId)) return;

    if (!response.ok) {
      const message = await getErrorMessage(response);
      updateMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "error",
          content: message,
        },
      ]);
      return;
    };

    const parts: ClientMessagePart[] = [];

    const stream = response
      .body!.pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream());

    for await (const { data } of stream) {
      if (!isActiveRequest(activeStream.requestId)) return;

      let event;

      try {
        event = chatStreamEventSchema.parse(JSON.parse(data));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid stream event";
        updateMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "error",
            content: message,
          },
        ]);
        break;
      }

      switch (event.type) {
        case "text-delta": {
          const last = parts[parts.length - 1];
          if (last && last.type === "text") {
            last.text += event.text;
          } else {
            parts.push({ type: "text", text: event.text });
          }
          emitParts(activeStream.requestId, parts);
          break;
        }
        case "done": {
          if (!isActiveRequest(activeStream.requestId)) return;

          const fullText = parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("");

          updateMessages((prev) => [
              ...prev,
              {
                id: event.messageId,
                role: "assistant",
                content: fullText,
                mode: activeStream.mode,
                model: activeStream.model,
                duration: prettyMs(event.durationMs),
                parts: [...parts],
              },
            ]);
          break;
        }
        case "error":
          updateMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "error",
              content: event.message,
            },
          ]);
          break;
      }
    }
  }, [updateMessages, emitParts, isActiveRequest]);

  const runStream = useCallback(async (
    { mode, model, request }: RunStreamParams
  ) => {
    const controller = new AbortController();
    const activeStream: ActiveStream = {
      requestId: crypto.randomUUID(),
      controller,
      mode,
      model,
      parts: [],
      interruptedCaptured: false,
    };

    activeStreamRef.current = activeStream;
    setStreaming({ status: "streaming", parts: [], mode, model });

    try {
      const response = await request(controller);
      await handleStream(response, activeStream);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      if (!isActiveRequest(activeStream.requestId)) return;

      const msg = err instanceof Error ? err.message : String(err);
      updateMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "error",
          content: msg,
        },
      ]);
    } finally {
      // Clean up the stream reference if it's still the active one
      if (isActiveRequest(activeStream.requestId)) {
        clearStream(activeStream.requestId);
      }
    }
  }, [clearStream, handleStream, isActiveRequest, updateMessages]);

  const stopActiveStream = useCallback((
    capturePartial: boolean
  ) => {
    const activeStream = activeStreamRef.current;
    if (!activeStream) return;

    if (capturePartial) {
      captureInterruptedMessage(activeStream);
    }

    activeStreamRef.current = null;
    setStreaming({ status: "idle" });
    activeStream.controller.abort();
  }, [captureInterruptedMessage]);

  const resume = useCallback(async (
    { mode, model }: Omit<SubmitParams, "userText">
  ) => {
    await runStream({
      mode,
      model,
      request: async (controller) => {
        return apiClient.chat[":sessionId"].resume.$post(
          { param: { sessionId } },
          { init: { signal: controller.signal } },
        );
      },
    });
  }, [runStream, sessionId]);

  // Auto-resume when the conversation ends with a user message that has no reply
  // Track by message ID to prevent duplicate resumes
  const hasAutoResumedRef = useRef<string | null>(null);
  useEffect(() => {
    const last = initialMessages[initialMessages.length - 1];
    if (!last || last.role !== "user") return;
    
    // Prevent multiple resumes for the same message
    if (hasAutoResumedRef.current === last.id) return;

    hasAutoResumedRef.current = last.id;
    void resume({ mode: last.mode, model: last.model });
  }, [initialMessages, resume]);

  const submit = useCallback(async (
    { userText, mode, model }: SubmitParams
  ) => {
    try {
      // Show the partial answer before sending the next message
      stopActiveStream(true);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: userText,
        mode,
        model,
      };
      updateMessages((prev) => [...prev, userMessage]);

      await runStream({
        mode,
        model,
        request: async (controller) => {
          return apiClient.chat[":sessionId"].$post(
            { 
              param: { sessionId },
              json: { content: userText, mode, model }
            },
            { init: { signal: controller.signal } },
          );
        },
      });
    } catch (err) {
      // runStream already handles errors internally, but catch any unexpected ones
      console.error("Unexpected error in submit:", err);
    }
  }, [runStream, sessionId, updateMessages, stopActiveStream]);

  const abort = useCallback(() => {
    stopActiveStream(false);
  }, [stopActiveStream]);

  const interrupt = useCallback(() => {
    stopActiveStream(true);
  }, [stopActiveStream]);

  return { messages, streaming, submit, abort, interrupt };
};