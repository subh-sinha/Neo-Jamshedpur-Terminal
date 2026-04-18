import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { SectionCard } from "../shared/SectionCard";
import { Button } from "../shared/Button";
import { TrustBadge } from "../shared/TrustBadge";

export function LeftSidebar() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-4">
      <SectionCard>
        <div className="flex flex-col items-center text-center">
          <img src={user?.avatar} alt={user?.fullName} className="h-20 w-20 rounded-full object-cover" />
          <div className="mt-3 text-lg font-semibold text-slate-50">{user?.fullName}</div>
          <div className="mt-1 text-sm text-slate-400">@{user?.username}</div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <TrustBadge value={user?.trustRank} />
          </div>
        </div>
        <div className="mt-5 space-y-3 text-sm text-slate-400">
          <div className="flex justify-between"><span>Trust score</span><span>{user?.reputationScore || 0}</span></div>
          <div className="flex justify-between"><span>Jobs</span><span>{user?.completedJobsCount || 0}</span></div>
          <div className="flex justify-between"><span>Trades</span><span>{user?.successfulTradesCount || 0}</span></div>
        </div>
      </SectionCard>
      <SectionCard title="Quick actions">
        <div className="grid gap-2">
          <Link to="/jobs/create"><Button className="w-full">Post job</Button></Link>
          <Link to="/trades/create"><Button variant="ghost" className="w-full">List trade</Button></Link>
          <Link to="/pulse/create"><Button variant="ghost" className="w-full">Share update</Button></Link>
        </div>
      </SectionCard>
    </div>
  );
}
