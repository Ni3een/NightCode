import { resolveChatModel } from "./packages/server/src/lib/models";

console.log("Testing Groq integration...\n");

try {
  const result = resolveChatModel("groq");
  console.log("✅ Groq model resolved successfully!");
  console.log("   Provider:", result.provider);
  console.log("   Model ID:", result.modelId);
  console.log("   Model object:", typeof result.model);
} catch (error) {
  console.error("❌ Groq model resolution failed:");
  console.error(error);
  process.exit(1);
}

try {
  const geminiResult = resolveChatModel("gemini");
  console.log("\n✅ Gemini model resolved successfully!");
  console.log("   Provider:", geminiResult.provider);
  console.log("   Model ID:", geminiResult.modelId);
} catch (error) {
  console.error("\n❌ Gemini model resolution failed:");
  console.error(error);
}
