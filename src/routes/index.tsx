import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, Search, MessageSquare, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Disclaimer } from "@/components/ai-output";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexusAI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate daily work: draft emails, summarize meetings, plan tasks and research topics with one AI workspace.",
      },
      { property: "og:title", content: "NexusAI — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "One AI workspace for emails, meeting notes, task planning and research.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Draft send-ready emails tuned to tone, audience and length.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Key points, decisions, owners and deadlines from raw notes.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    body: "Prioritize by urgency and impact, then time-block the day.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Structured briefings, trade-offs and recommended next steps.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Good morning, Sarah"
      description="Pick a workspace and let the assistant handle the first draft."
      actions={
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-dark"
        >
          <MessageSquare className="size-4" />
          Ask the assistant
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          {tools.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
            >
              <div>
                <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-4 font-display text-lg tracking-tight">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                Open workspace
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-display text-lg tracking-tight">Today at a glance</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-brand/15 bg-brand/5 p-3">
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-brand">
                    High priority
                  </span>
                  <span className="text-[10px] text-muted-foreground">Due in 2h</span>
                </div>
                <p className="mt-1 text-sm font-medium">Review Q3 marketing proposal</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/50 p-3">
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Scheduled
                  </span>
                  <span className="text-[10px] text-muted-foreground">3:00 PM</span>
                </div>
                <p className="mt-1 text-sm font-medium">Sync with design lead</p>
              </div>
              <Link
                to="/planner"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
              >
                Re-plan my day
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-shell p-6 text-shell-foreground">
            <div className="relative z-10">
              <h2 className="font-display text-lg tracking-tight">Research on demand</h2>
              <p className="mt-2 text-sm text-shell-muted">
                Get a structured briefing on any topic before your next meeting.
              </p>
              <Link
                to="/research"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-shell-foreground/20 bg-shell-foreground/10 py-2.5 text-xs font-semibold transition-colors hover:bg-shell-foreground/20"
              >
                Run research agent
              </Link>
            </div>
            <div className="absolute -right-12 -top-12 size-40 rounded-full bg-brand/30 blur-3xl" />
          </section>

          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}
