import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Panel, Field, TextArea, Select, GenerateButton } from "@/components/tool-form";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | NexusAI Workplace Assistant" },
      {
        name: "description",
        content:
          "Prioritize and schedule your workload automatically with an AI planner that ranks tasks by urgency and impact.",
      },
      { property: "og:title", content: "AI Task Planner | NexusAI" },
      {
        property: "og:description",
        content: "Turn a messy task list into a prioritized, time-blocked plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const HORIZONS = ["Today", "Tomorrow", "This week", "Next two weeks"] as const;

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<string>(HORIZONS[0]);
  const fn = useServerFn(planTasks);
  const mutation = useMutation({ mutationFn: () => fn({ data: { tasks, horizon } }) });
  const result = mutation.data;

  return (
    <AppShell
      title="AI Task Planner"
      description="Prioritization and scheduling for everything on your plate."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (tasks.trim()) mutation.mutate();
          }}
        >
          <Panel title="Task dump">
            <Field label="Everything you need to get done">
              <TextArea
                rows={12}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"Review Q3 marketing proposal (due tomorrow)\nPrep board slides\nInterview two candidates\nReply to vendor contract email\nGym"}
              />
            </Field>
            <Field label="Planning horizon">
              <Select
                options={HORIZONS}
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
              />
            </Field>
            <GenerateButton loading={mutation.isPending} disabled={!tasks.trim()}>
              Build my plan
            </GenerateButton>
          </Panel>
        </form>

        <AiOutput
          title="Prioritized plan"
          loading={mutation.isPending}
          error={
            mutation.error
              ? "Something went wrong building the plan."
              : result && !result.ok
                ? result.error
                : null
          }
          text={result && result.ok ? result.text : null}
          emptyHint="List your tasks — you'll get a priority table, a schedule and what to defer."
        />
      </div>
    </AppShell>
  );
}
