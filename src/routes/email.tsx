import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Panel, Field, TextArea, Select, GenerateButton } from "@/components/tool-form";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | NexusAI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft professional business emails in seconds with tone and audience controls, powered by AI.",
      },
      { property: "og:title", content: "Smart Email Generator | NexusAI" },
      {
        property: "og:description",
        content: "Generate polished work emails tuned to your tone and audience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Direct", "Diplomatic", "Friendly", "Urgent", "Apologetic"] as const;
const AUDIENCES = [
  "Internal team",
  "Executive leadership",
  "Client",
  "External partner",
  "Vendor",
  "Candidate",
] as const;
const LENGTHS = ["Short (under 100 words)", "Standard (100-180 words)", "Detailed (200+ words)"] as const;

function EmailPage() {
  const [intent, setIntent] = useState("");
  const [tone, setTone] = useState<string>(TONES[0]);
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [length, setLength] = useState<string>(LENGTHS[1]);

  const fn = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: () => fn({ data: { intent, tone, audience, length } }),
  });

  const result = mutation.data;

  return (
    <AppShell
      title="Smart Email Generator"
      description="Turn a rough intent into a polished, send-ready email."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (intent.trim()) mutation.mutate();
          }}
        >
          <Panel title="Email brief">
            <Field label="What do you want to say?">
              <TextArea
                rows={7}
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Request a follow-up meeting with the engineering team regarding the Q3 roadmap slip, and propose Thursday afternoon."
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tone">
                <Select
                  options={TONES}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
              </Field>
              <Field label="Audience">
                <Select
                  options={AUDIENCES}
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </Field>
            </div>
            <Field label="Length">
              <Select
                options={LENGTHS}
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </Field>
            <GenerateButton loading={mutation.isPending} disabled={!intent.trim()}>
              Draft email
            </GenerateButton>
          </Panel>
        </form>

        <AiOutput
          title="Generated draft"
          loading={mutation.isPending}
          error={
            mutation.error
              ? "Something went wrong generating the email."
              : result && !result.ok
                ? result.error
                : null
          }
          text={result && result.ok ? result.text : null}
          emptyHint="Describe your message and pick a tone — your draft will appear here."
        />
      </div>
    </AppShell>
  );
}
