import { Panel } from "../shared/Panel";

const suggestions = [
  "Recommend jobs based on my completed infrastructure work.",
  "Summarize today's critical city pulse.",
  "Which trade listings fit my trust rank?",
  "Explain what disputes lock in the job lifecycle."
];

export function AssistantPanel({ jobs = [], pulse = [] }) {
  const highlightedJob = jobs[0];
  const highlightedPulse = pulse[0];

  return (
    <Panel className="relative overflow-hidden scanline">
      <div className="font-mono text-xs uppercase tracking-[0.32em] text-cyber">NIA // Neural Interface Assistant</div>
      <div className="mt-3 text-lg font-semibold">Navigation, summaries, and trust-aware recommendations.</div>
      <div className="mt-4 rounded-2xl border border-cyber/20 bg-black/20 p-4">
        <div className="text-sm text-slate-300">
          {highlightedPulse
            ? `Critical summary: ${highlightedPulse.title}. ${highlightedPulse.summary}`
            : "No urgent summary available."}
        </div>
        <div className="mt-3 text-sm text-slate-400">
          Suggested job: {highlightedJob ? highlightedJob.title : "No match yet"}.
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {suggestions.map((suggestion) => (
          <button key={suggestion} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-cyber/30 hover:text-white">
            {suggestion}
          </button>
        ))}
      </div>
    </Panel>
  );
}
