import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Panel, Field, TextArea, GenerateButton } from "@/components/tool-form";
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | NexusAI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into key points, decisions, owners and deadlines with AI summarization.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | NexusAI" },
      {
        property: "og:description",
        content: "Extract key points, action items and deadlines from any meeting transcript.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

const SAMPLE = `Weekly product sync - attendees: Sarah, Mark, Priya, Tom
- Aurora launch slipping ~2 weeks, blocked on billing migration (Tom)
- Mark: legal review of partner contract still open, needs sign-off before Friday
- Budget reallocation to NA region approved by finance
- Priya raised concern about support headcount for launch week
- Next sync moved to Tuesday 10am`;

function NotesPage() {
  const [notes, setNotes] = useState("");
  const fn = useServerFn(summarizeNotes);
  const mutation = useMutation({ mutationFn: () => fn({ data: { notes } }) });
  const result = mutation.data;

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Key points, decisions, action items and deadlines — extracted automatically."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (notes.trim()) mutation.mutate();
          }}
        >
          <Panel title="Raw notes or transcript">
            <Field label="Paste your notes">
              <TextArea
                rows={14}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste meeting notes, bullet points or a raw transcript…"
              />
            </Field>
            <div className="flex flex-wrap items-center gap-3">
              <GenerateButton loading={mutation.isPending} disabled={!notes.trim()}>
                Summarize
              </GenerateButton>
              <button
                type="button"
                onClick={() => setNotes(SAMPLE)}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Use sample notes
              </button>
            </div>
          </Panel>
        </form>

        <AiOutput
          title="Structured summary"
          loading={mutation.isPending}
          error={
            mutation.error
              ? "Something went wrong summarizing the notes."
              : result && !result.ok
                ? result.error
                : null
          }
          text={result && result.ok ? result.text : null}
          emptyHint="Paste notes on the left to get a summary, decisions and an action-item table."
        />
      </div>
    </AppShell>
  );
}
