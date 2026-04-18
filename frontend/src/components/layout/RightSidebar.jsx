import { BriefcaseBusiness, Radio, Repeat2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { jobsApi, pulseApi, tradesApi } from "../../api/services";
import { SectionCard } from "../shared/SectionCard";
import { PriorityBadge } from "../shared/PriorityBadge";
import { Link } from "react-router-dom";
import { SkeletonCard } from "../shared/SkeletonCard";
import { formatCurrency } from "../../lib/utils";

function SidebarListLoader({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => <SkeletonCard key={index} />)}
    </div>
  );
}

export function RightSidebar() {
  const pulse = useQuery({ queryKey: ["right-rail-pulse"], queryFn: () => pulseApi.list({ sort: "trending" }) });
  const jobs = useQuery({ queryKey: ["right-rail-jobs"], queryFn: () => jobsApi.list({ urgency: "high" }) });
  const trades = useQuery({ queryKey: ["right-rail-trades"], queryFn: () => tradesApi.list({}) });

  return (
    <div className="space-y-4">
      <SectionCard title="Critical & trending" icon={Radio}>
        {pulse.isLoading ? (
          <SidebarListLoader />
        ) : (
          <div className="space-y-3">
            {pulse.data?.slice(0, 3).map((post) => (
              <Link key={post._id} to={`/pulse/${post._id}`} className="block rounded-2xl border border-slate-700 p-3 hover:bg-slate-800/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="line-clamp-2 text-sm font-medium text-slate-50">{post.title}</div>
                  <PriorityBadge value={post.priority} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
      <SectionCard title="Suggested jobs" icon={BriefcaseBusiness}>
        {jobs.isLoading ? (
          <SidebarListLoader />
        ) : (
          <div className="space-y-3">
            {jobs.data?.slice(0, 3).map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`} className="block rounded-2xl border border-slate-700 p-3 hover:bg-slate-800/50">
                <div className="text-sm font-medium text-slate-50">{job.title}</div>
                <div className="mt-1 text-xs text-slate-400">{job.locationText || job.sector || "Neo-Jamshedpur"} / {formatCurrency(job.budget)}</div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
      <SectionCard title="Trade suggestions" icon={Repeat2}>
        {trades.isLoading ? (
          <SidebarListLoader count={2} />
        ) : (
          <div className="space-y-3">
            {trades.data?.slice(0, 2).map((trade) => (
              <Link key={trade._id} to={`/trades/${trade._id}`} className="block rounded-2xl border border-slate-700 p-3 hover:bg-slate-800/50">
                <div className="text-sm font-medium text-slate-50">{trade.title}</div>
                <div className="mt-1 text-xs text-slate-400">{trade.category}</div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
