import { useQuery } from "@tanstack/react-query";
import { jobsApi, notificationApi, pulseApi, tradesApi } from "../../api/services";
import { useAuthStore } from "../../store/authStore";
import { HeroPanel } from "../../components/dashboard/HeroPanel";
import { MetricCard } from "../../components/shared/MetricCard";
import { ActivityTimeline } from "../../components/dashboard/ActivityTimeline";
import { AssistantPanel } from "../../components/assistant/AssistantPanel";
import { SectorMap } from "../../components/map/SectorMap";
import { JobCard } from "../../components/jobs/JobCard";
import { TradeCard } from "../../components/trades/TradeCard";
import { PulseCard } from "../../components/pulse/PulseCard";
import { EmptyState } from "../../components/shared/EmptyState";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: () => jobsApi.list({}) });
  const trades = useQuery({ queryKey: ["trades"], queryFn: () => tradesApi.list({}) });
  const pulse = useQuery({ queryKey: ["pulse"], queryFn: () => pulseApi.list({}) });
  const notifications = useQuery({ queryKey: ["notifications"], queryFn: notificationApi.list, enabled: Boolean(user) });

  const criticalAlert = pulse.data?.find((item) => item.priority === "critical");

  return (
    <div className="space-y-6">
      <HeroPanel user={user} criticalAlert={criticalAlert} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Trust Score" value={user?.reputationScore || 0} detail={`${user?.trustRank || "New"} standing`} />
        <MetricCard label="Completed Jobs" value={user?.completedJobsCount || 0} detail="Verified task completions" />
        <MetricCard label="Successful Trades" value={user?.successfulTradesCount || 0} detail="Confirmed exchanges" />
        <MetricCard label="Unread Notifications" value={notifications.data?.filter((item) => !item.readAt).length || 0} detail="Cross-module alerts" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {jobs.data?.slice(0, 2).map((job) => <JobCard key={job._id} job={job} />)}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {trades.data?.slice(0, 2).map((trade) => <TradeCard key={trade._id} trade={trade} />)}
          </div>
          <SectorMap />
          {user?.recentActivity?.length ? (
            <ActivityTimeline items={user.recentActivity} />
          ) : (
            <EmptyState title="No recent activity yet" description="Your dashboard will start logging reputation shifts, negotiations, and lifecycle actions as you use the terminal." />
          )}
        </div>
        <div className="space-y-6">
          <AssistantPanel jobs={jobs.data} pulse={pulse.data} />
          <div className="space-y-4">
            {pulse.data?.slice(0, 3).map((post) => <PulseCard key={post._id} post={post} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
