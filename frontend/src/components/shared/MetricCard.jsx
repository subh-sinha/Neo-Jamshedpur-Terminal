import { Panel } from "./Panel";

export function MetricCard({ label, value, detail }) {
  return (
    <Panel className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber/60 to-transparent" />
      <div className="font-mono text-xs uppercase tracking-[0.28em] text-mist">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{detail}</div>
    </Panel>
  );
}
