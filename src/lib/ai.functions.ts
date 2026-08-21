import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailSchema = z.object({
  intent: z.string().min(1),
  tone: z.string(),
  audience: z.string(),
  length: z.string(),
});
const NotesSchema = z.object({ notes: z.string().min(1) });
const PlannerSchema = z.object({ tasks: z.string().min(1), horizon: z.string() });
const ResearchSchema = z.object({ topic: z.string().min(1), depth: z.string() });
const ChatSchema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).min(1),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailSchema.parse(d))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai-run.server");
    const { emailPrompt } = await import("./prompts.server");
    return runPrompt(emailPrompt(data));
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesSchema.parse(d))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai-run.server");
    const { notesPrompt } = await import("./prompts.server");
    return runPrompt(notesPrompt(data));
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlannerSchema.parse(d))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai-run.server");
    const { plannerPrompt } = await import("./prompts.server");
    return runPrompt(plannerPrompt(data));
  });

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchSchema.parse(d))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai-run.server");
    const { researchPrompt } = await import("./prompts.server");
    return runPrompt(researchPrompt(data));
  });

export const chat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatSchema.parse(d))
  .handler(async ({ data }) => {
    const { runChat } = await import("./ai-run.server");
    return runChat(data.messages);
  });
