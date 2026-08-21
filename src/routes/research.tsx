import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Panel, Field, TextArea, Select, GenerateButton } from "@/components/tool-form";
import { runResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | NexusAI Workplace Assistant" },
      {
        name: "description",
        content:
          "Get structured briefings, key insights and recommended next steps on any work topic in seconds.",
      },
      { property: "og:title", content: "AI Research Assistant | NexusAI" },
      {
        property: "og:description",
        content: "Structured insights, trade-offs and next steps on any business topic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick scan", "Standard briefing", "Deep dive"] as const;

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<string>(DEPTHS[1]);
  const fn = useServerFn(runResearch);
  const mutation = useMutation({ mutationFn: () => fn({ data: { topic, depth } }) });
  const result = mutation.data;

  return (
    <AppShell
      title="AI Research Assistant"
      description="Structured insights and summaries on any business topic."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (topic.trim()) mutation.mutate();
          }}
        >
          <Panel title="Research request">
            <Field label="Topic or question">
              <TextArea
                rows={8}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Market trends for sustainable energy procurement in EU mid-market manufacturing."
              />
            </Field>
            <Field label="Depth">
              <Select
                options={DEPTHS}
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
              />
            </Field>
            <GenerateButton loading={mutation.isPending} disabled={!topic.trim()}>
              Run research
            </GenerateButton>
          </Panel>
        </form>

        <AiOutput
          title="Research briefing"
          loading={mutation.isPending}
          error={
            mutation.error
              ? "Something went wrong running the research."
              : result && !result.ok
                ? result.error
                : null
          }
          text={result && result.ok ? result.text : null}
          emptyHint="Ask a question — you'll get a briefing, insights, trade-offs and next steps."
        />
      </div>
    </AppShell>
  );
}
