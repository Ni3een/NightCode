import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  findSupportedChatModel,
  type SupportedChatModel,
  type SupportedChatModelId,
  type SupportedProvider,
} from "@nightcode/shared";
import type { LanguageModel } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

type AnthropicModelId = Extract<SupportedChatModel, { provider: "anthropic" }>["id"];
type OpenAIModelId = Extract<SupportedChatModel, { provider: "openai" }>["id"];
type GroqModelId = Extract<SupportedChatModel, { provider: "groq" }>["id"];
type GoogleModelId = Extract<SupportedChatModel, { provider: "google" }>["id"];

export type ResolvedModel = {
  model: LanguageModel;
  provider: SupportedProvider;
  modelId: SupportedChatModelId;
  providerOptions?: Record<string, any>;
};

type AnthropicOptions = {
  thinking?: {
    type: "enabled" | "disabled";
    budgetTokens?: number;
  };
};


const ANTHROPIC_PROVIDER_OPTIONS: Partial<Record<AnthropicModelId, AnthropicOptions>> = {
  "claude-opus-4-6": {
    thinking: {
      type: "enabled",
      budgetTokens: 10000,
    },
  },
  "claude-sonnet-4-6": {
    thinking: {
      type: "enabled",
      budgetTokens: 10000,
    },
  },
};


function assertUnsupportedProvider(provider: never): never {
  throw new Error(`Unsupported provider: ${provider}`);
};
function resolveAnthropicModel(modelId: AnthropicModelId): ResolvedModel {
  const options = ANTHROPIC_PROVIDER_OPTIONS[modelId];
  return {
    model: anthropic(modelId),
    provider: "anthropic",
    modelId,
    ...(options ? { providerOptions: { anthropic: options } } : {}),
  };
}
function resolveOpenAIModel(modelId: OpenAIModelId): ResolvedModel {
  return {
    model: openai(modelId),
    provider: "openai",
    modelId,
  };
}

function resolveGroqModel(modelId: GroqModelId): ResolvedModel {
  // Groq uses specific model names like "llama-3.3-70b-versatile"
  // Map your custom ID to the actual Groq model name
  const groqModelMap: Record<GroqModelId, string> = {
    "groq": "llama-3.3-70b-versatile", // Default Groq model
  };

  return {
    model: groq(groqModelMap[modelId]),
    provider: "groq",
    modelId,
  };
}

function resolveGoogleModel(modelId: GoogleModelId): ResolvedModel {
  // Map your custom ID to actual Google model names
  const googleModelMap: Record<GoogleModelId, string> = {
    "gemini": "gemini-2.0-flash", // Default Gemini model
  };

  return {
    model: google(googleModelMap[modelId]),
    provider: "google",
    modelId,
  };
}
function resolveSupportedChatModel(model: SupportedChatModel): ResolvedModel {
  const provider = model.provider;

  switch (provider) {
    case "anthropic":
      return resolveAnthropicModel(model.id);
    case "openai":
      return resolveOpenAIModel(model.id);
    case "groq":
      return resolveGroqModel(model.id);
    case "google":
      return resolveGoogleModel(model.id);
    default:
      return assertUnsupportedProvider(provider);
  }
};
export function isSupportedChatModel(modelId: string): modelId is SupportedChatModelId {
  return findSupportedChatModel(modelId) != null;
};

export function resolveChatModel(modelId: string): ResolvedModel {
  const model = findSupportedChatModel(modelId);
  if (!model) {
    throw new Error(`Unsupported model: ${modelId}`);
  }

  return resolveSupportedChatModel(model);
};
