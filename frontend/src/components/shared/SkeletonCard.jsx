export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-700 bg-panel p-5">
      <div className="h-4 w-32 rounded bg-slate-700" />
      <div className="mt-3 h-3 w-48 rounded bg-slate-800" />
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded bg-slate-800" />
        <div className="h-3 w-5/6 rounded bg-slate-800" />
        <div className="h-3 w-2/3 rounded bg-slate-800" />
      </div>
    </div>
  );
}
