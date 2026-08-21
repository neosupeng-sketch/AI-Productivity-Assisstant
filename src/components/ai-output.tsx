import ReactMarkdown from "react-markdown";
import { Copy, Check, AlertTriangle, Info, Sparkles } from "lucide-react";
import { useState } from "react";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground ${className}`}
    >
      <Info className="mt-px size-3.5 shrink-0" />
      AI-generated content may require human review.
    </p>
  );
}

function Shimmer() {
  return (
    <div className="space-y-3">
      {["w-1/3", "w-full", "w-5/6", "w-2/3", "w-4/5", "w-1/2"].map((w, i) => (
        <div
          key={i}
          className={`h-3.5 animate-pulse rounded bg-muted ${w}`}
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

export function AiOutput({
  loading,
  error,
  text,
  emptyHint,
  title = "AI Output",
}: {
  loading: boolean;
  error?: string | null;
  text?: string | null;
  emptyHint: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="flex min-h-[26rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-base">{title}</h2>
          {loading ? (
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-brand" />
              Generating
            </span>
          ) : text ? (
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
              Ready
            </span>
          ) : null}
        </div>
        {text && !loading ? (
          <button
            onClick={copy}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        {loading ? (
          <Shimmer />
        ) : error ? (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : text ? (
          <div className="prose-ai">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <span className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">
              <Sparkles className="size-4" />
            </span>
            <p className="max-w-xs text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}
      </div>

      <div className="border-t border-border px-6 py-4">
        <Disclaimer />
      </div>
    </section>
  );
}
