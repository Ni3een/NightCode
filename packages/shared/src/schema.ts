import { z } from "zod";

// Keep the explicit key schema here because the one-argument z.record(...) form
// does not type-check cleanly with the Zod typings used in this workspace.
export const toolCallArgsSchema = z.record(z.string(), z.json());
/*2. messagePartSchema — Ek Message Ke Parts
AI ka ek message teen types ka ho sakta hai:
tsz.discriminatedUnion("type", [...])
// "type" field dekho aur decide karo kaunsa object hai
TypeMatlabreasoningAI ka sochna — "Let me think..."tool-callAI ne koi tool use kiya — file read, command runtextNormal text response*/
export const messagePartSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("reasoning"), // { type: "reasoning", text: "I should check the file first..." }

    text: z.string(),  
  }),
  z.object({
    type: z.literal("tool-call"), // { type: "tool-call", id: "123", name: "readFile", args: {...}, result: "..." }

    id: z.string(),
    name: z.string(),
    args: toolCallArgsSchema,
    result: z.string().optional(),
  }),
  z.object({                // { type: "text", text: "Here is the fix..." }

    type: z.literal("text"),
    text: z.string(),
  }),
]);

export const messagePartsSchema = z.array(messagePartSchema);

export type MessagePart = z.infer<typeof messagePartSchema>;

// Tool-call args stay as nested JSON on the wire so the client does not need
// a second JSON.parse step after decoding the SSE event payload itself.

// kya ai llm se aa skte hai
export const chatStreamEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text-delta"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("reasoning-delta"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("tool-call"),
    toolCallId: z.string(),
    toolName: z.string(),
    args: toolCallArgsSchema,
  }),
  z.object({
    type: z.literal("tool-result"),
    toolCallId: z.string(),
    result: z.string(),
  }),
  z.object({
    type: z.literal("done"),
    messageId: z.string(),
    durationMs: z.number(),
  }),
  z.object({
    type: z.literal("error"),
    message: z.string(),
  }),
]);

export type ChatStreamEvent = z.infer<typeof chatStreamEventSchema>;