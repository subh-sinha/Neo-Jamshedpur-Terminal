import { cn } from "../../lib/utils";
import { Panel } from "./Panel";

export function MetricCard({ label, value, detail, icon: Icon, iconClassName }) {
  return (
    <Panel className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber/60 to-transparent" />
      <div className="flex items-center gap-2">
        {Icon ? (
          <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-300", iconClassName)}>
            <Icon size={18} />
          </span>
        ) : null}
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-mist">{label}</div>
      </div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{detail}</div>
    </Panel>
  );
}
