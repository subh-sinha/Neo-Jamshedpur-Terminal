import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { pulseApi } from "../../api/services";
import { PulseCard } from "../../components/pulse/PulseCard";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { Button } from "../../components/shared/Button";

export function PulseFeedPage() {
  const [filters, setFilters] = useState({ q: "", category: "", priority: "", sort: "priority" });
  const { data = [] } = useQuery({
    queryKey: ["pulse", filters],
    queryFn: () => pulseApi.list(filters),
    refetchInterval: 15000
  });

  const critical = data.find((post) => post.priority === "CRITICAL");

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="The Pulse" title="Real-time city alerts, official updates, and community intelligence" action={<Link to="/pulse/create"><Button>Create post</Button></Link>} />
      {critical ? (
        <Link to={`/pulse/${critical._id}`} className="block rounded-3xl border border-danger/40 bg-danger/12 p-5 shadow-danger">
          <div className="font-mono text-xs uppercase tracking-[0.32em] text-danger">Critical city alert</div>
          <div className="mt-2 text-2xl font-semibold text-white">{critical.title}</div>
          <div className="mt-2 text-sm text-slate-300">{critical.summary}</div>
        </Link>
      ) : null}
      <div className="panel grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none xl:col-span-2" value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))} placeholder="Search alerts, districts, categories, titles" />
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
          <option value="">All categories</option>
          <option value="ALERT">Alert</option>
          <option value="INFRASTRUCTURE">Infrastructure</option>
          <option value="EVENT">Event</option>
          <option value="COMMUNITY">Community</option>
          <option value="TREND">Trend</option>
          <option value="SAFETY">Safety</option>
        </select>
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}>
          <option value="">All priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="NORMAL">Normal</option>
        </select>
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}>
          <option value="priority">Priority</option>
          <option value="latest">Latest</option>
          <option value="trending">Trending</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((post) => <PulseCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
