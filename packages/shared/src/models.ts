export type ModelPricing = {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
};

export type SupportedProvider = "anthropic" | "openai" | "groq" | "google"

// Mirrors Prisma enums — defined here so CLI doesn't depend on the
// database/Prisma runtime package.
export type Mode = "BUILD" | "PLAN";
export type MessageStatus = "PENDING" | "COMPLETE" | "INTERRUPTED";

// Const object for enum-like usage (e.g., MessageStatus.INTERRUPTED)
export const MessageStatus = {
  PENDING: "PENDING",
  COMPLETE: "COMPLETE",
  INTERRUPTED: "INTERRUPTED",
} as const;

type SupportedChatModelDefinition = {
  id: string; // model ka naam

  provider: SupportedProvider; // anthropic ya openai

  pricing: ModelPricing;  //upar wali pricing
};

export const SUPPORTED_CHAT_MODELS = [
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    pricing: {
      inputUsdPerMillionTokens: 3,
      outputUsdPerMillionTokens: 15,
    },
  },
  {
    id: "claude-haiku-4-5",
    provider: "anthropic",
    pricing: {
      inputUsdPerMillionTokens: 1,
      outputUsdPerMillionTokens: 5,
    },
  },
  {
    id: "claude-opus-4-6",
    provider: "anthropic",
    pricing: {
      inputUsdPerMillionTokens: 5,
      outputUsdPerMillionTokens: 25,
    },
  },
  {
    id: "gpt-5.4",
    provider: "openai",
    pricing: {
      inputUsdPerMillionTokens: 2.5,
      outputUsdPerMillionTokens: 15,
    },
  },
  {
    id: "gpt-5.4-mini",
    provider: "openai",
    pricing: {
      inputUsdPerMillionTokens: 0.75,
      outputUsdPerMillionTokens: 4.5,
    },
  },
  {
    id: "gpt-5.4-nano",
    provider: "openai",
    pricing: {
      inputUsdPerMillionTokens: 0.2,
      outputUsdPerMillionTokens: 1.25,
    },
  },
  {
    id:"groq",
    provider:"groq",
    pricing:{
      inputUsdPerMillionTokens:0.3,
      outputUsdPerMillionTokens:1.34
    }
  },
  {
    id:"gemini",
    provider:"google",
    pricing:{
      inputUsdPerMillionTokens:0.3,
      outputUsdPerMillionTokens:1.24

    }
  }
] as const satisfies readonly SupportedChatModelDefinition[];

export type SupportedChatModel = (typeof SUPPORTED_CHAT_MODELS)[number];
export type SupportedChatModelId = SupportedChatModel["id"];

export function findSupportedChatModel(modelId: string) {
  return SUPPORTED_CHAT_MODELS.find((model) => model.id === modelId);
}

export const DEFAULT_CHAT_MODEL_ID: SupportedChatModelId = "groq";
/**
 Maine ek centralized model config banaya shared package mein — 
 saare supported AI models, unki pricing, aur provider ek jagah define hai.
 as const satisfies pattern use kiya taaki
 TypeScript strict type safety de aur array immutable rahe. Helper function se 
 koi bhi model id se dhundh sakta hai,
 aur default model bhi define hai."
 */