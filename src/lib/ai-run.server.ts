import { streamText } from "ai";
import { getGateway, MODEL } from "./ai-gateway.server";
import { CHAT_SYSTEM } from "./prompts.server";

export type AiResult = { ok: true; text: string } | { ok: false; error: string };

function toMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (/402|payment|credit/i.test(raw))
    return "The workspace is out of AI credits. Add credits in Lovable to keep generating.";
  if (/429|rate limit/i.test(raw)) return "Too many requests right now. Wait a moment and try again.";
  if (/401|403/.test(raw)) return "AI access is not available for this workspace.";
  return raw || "The AI request failed.";
}

export async function runPrompt(input: { system: string; prompt: string }): Promise<AiResult> {
  try {
    const gateway = getGateway();
    const result = streamText({
      model: gateway(MODEL),
      system: input.system,
      prompt: input.prompt,
    });
    return { ok: true, text: await result.text };
  } catch (err) {
    return { ok: false, error: toMessage(err) };
  }
}

export async function runChat(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<AiResult> {
  try {
    const gateway = getGateway();
    const result = streamText({
      model: gateway(MODEL),
      system: CHAT_SYSTEM,
      messages,
    });
    return { ok: true, text: await result.text };
  } catch (err) {
    return { ok: false, error: toMessage(err) };
  }
}
