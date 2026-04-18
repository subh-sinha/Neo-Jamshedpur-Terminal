import { ArrowRight, BriefcaseBusiness, Radio, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Panel } from "../shared/Panel";

const suggestions = [
  {
    label: "Recommended jobs",
    description: "See jobs that match recent work",
    icon: BriefcaseBusiness,
    action: ({ navigate, highlightedJob }) => navigate(highlightedJob ? `/jobs/${highlightedJob._id}` : "/jobs")
  },
  {
    label: "Latest pulse",
    description: "Open the most important city update",
    icon: Radio,
    action: ({ navigate, highlightedPulse }) => navigate(highlightedPulse ? `/pulse/${highlightedPulse._id}` : "/pulse")
  },
  {
    label: "Search trades",
    description: "Browse the trade marketplace",
    icon: Search,
    action: ({ navigate }) => navigate("/trades")
  }
];

export function AssistantPanel({ jobs = [], pulse = [] }) {
  const navigate = useNavigate();
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
          <button
            key={suggestion.label}
            type="button"
            onClick={() => suggestion.action({ navigate, highlightedJob, highlightedPulse })}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-cyber/30 hover:text-white"
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-300">
                <suggestion.icon size={18} />
              </span>
              <span>
                <span className="block font-medium text-white">{suggestion.label}</span>
                <span className="mt-1 block text-xs text-slate-400">{suggestion.description}</span>
              </span>
            </span>
            <ArrowRight size={16} className="text-slate-500" />
          </button>
        ))}
      </div>
    </Panel>
  );
}
