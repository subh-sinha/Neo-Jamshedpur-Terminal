import { cn } from "../../lib/utils";

const palette = {
  critical: "bg-danger/20 text-danger border-danger/40",
  high: "bg-ember/20 text-ember border-ember/40",
  verified: "bg-cyber/20 text-cyber border-cyber/40",
  completed: "bg-cyber/20 text-cyber border-cyber/40",
  trusted: "bg-cobalt/20 text-cobalt border-cobalt/40",
  disputed: "bg-danger/20 text-danger border-danger/40",
  cancelled: "bg-white/10 text-slate-300 border-white/10",
  default: "bg-white/10 text-slate-200 border-white/10"
};

export function StatusBadge({ value }) {
  const key = String(value || "").toLowerCase();
  const style = palette[key] || palette.default;
  return <span className={cn("rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]", style)}>{String(value || "Unknown").replaceAll("_", " ")}</span>;
}
