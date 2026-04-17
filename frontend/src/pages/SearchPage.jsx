import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/services";
import { JobCard } from "../components/jobs/JobCard";
import { TradeCard } from "../components/trades/TradeCard";
import { PulseCard } from "../components/pulse/PulseCard";
import { Panel } from "../components/shared/Panel";

export function SearchPage() {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search).get("q") || "", [location.search]);
  const { data } = useQuery({ queryKey: ["search", query], queryFn: () => searchApi.global(query), enabled: Boolean(query) });

  if (!query) {
    return (
      <Panel>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-cyber">Discovery Engine</div>
        <div className="mt-3 text-2xl font-semibold">Start searching the terminal</div>
        <div className="mt-2 text-sm text-slate-400">Use the global search bar to find jobs, trades, Pulse updates, users, and sectors.</div>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-cyber">Discovery Engine</div>
        <div className="mt-3 text-2xl font-semibold">Search results for "{query}"</div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4">
          <div className="text-lg font-semibold">Jobs</div>
          {data?.jobs?.map((item) => <JobCard key={item._id} job={item} />)}
        </div>
        <div className="space-y-4">
          <div className="text-lg font-semibold">Trades</div>
          {data?.trades?.map((item) => <TradeCard key={item._id} trade={item} />)}
        </div>
        <div className="space-y-4">
          <div className="text-lg font-semibold">Pulse</div>
          {data?.pulse?.map((item) => <PulseCard key={item._id} post={item} />)}
        </div>
      </div>
    </div>
  );
}
