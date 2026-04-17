export function EmptyState({ title, description }) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center gap-2 p-8 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.32em] text-cyber/70">Idle Node</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="max-w-md text-sm text-slate-400">{description}</div>
    </div>
  );
}
