import { Panel } from "./Panel";

export function CardSkeleton() {
  return (
    <Panel className="h-full animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-2/3 rounded bg-white/10" />
          <div className="h-4 w-1/2 rounded bg-white/5" />
        </div>
        <div className="h-6 w-16 rounded-full bg-white/10" />
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-white/5" />
        <div className="h-4 w-full rounded bg-white/5" />
        <div className="h-4 w-2/3 rounded bg-white/5" />
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="h-4 w-20 rounded bg-white/10" />
        <div className="h-4 w-24 rounded bg-white/5" />
      </div>
    </Panel>
  );
}
