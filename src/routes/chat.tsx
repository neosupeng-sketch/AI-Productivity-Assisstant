import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Disclaimer } from "@/components/ai-output";
import { chat } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat | NexusAI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant to draft, plan and think through daily work tasks.",
      },
      { property: "og:title", content: "AI Assistant Chat | NexusAI" },
      {
        property: "og:description",
        content: "A conversational assistant for everyday professional work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me say no to a meeting politely",
  "Draft a status update for my manager",
  "How should I structure a project kickoff?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi Sarah — how can I help you get through today's work? Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const send = useServerFn(chat);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await send({ data: { messages: next } });
      if (res.ok) {
        setMessages([...next, { role: "assistant", content: res.text }]);
      } else {
        setError(res.error);
      }
    } catch {
      setError("The assistant is unavailable right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Assistant" description="Your always-on assistant for everyday work.">
      <section className="flex h-[calc(100vh-14rem)] min-h-[30rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex items-start gap-3"}
            >
              {m.role === "assistant" ? (
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                  <Sparkles className="size-3.5" />
                </span>
              ) : null}
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-sm text-brand-foreground"
                    : "prose-ai max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3"
                }
              >
                {m.role === "user" ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Thinking…
            </div>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div ref={bottomRef} />
        </div>

        {messages.length === 1 ? (
          <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3 sm:px-6">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="border-t border-border p-4 sm:px-6"
        >
          <div className="flex items-end gap-3">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask NexusAI anything about your work…"
              className="max-h-40 min-h-11 flex-1 resize-none rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm outline-none transition focus:border-brand/40 focus:bg-surface focus:ring-2 focus:ring-brand/15"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              <SendHorizonal className="size-4" />
              <span className="sr-only">Send</span>
            </button>
          </div>
          <Disclaimer className="mt-3" />
        </form>
      </section>
    </AppShell>
  );
}
