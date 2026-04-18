import { BellRing, BriefcaseBusiness, Bot, HeartHandshake, Newspaper, ShieldCheck } from "lucide-react";
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
import { SectionCard } from "../../components/shared/SectionCard";
import { SkeletonCard } from "../../components/shared/SkeletonCard";

function FeedSection({ title, icon, isLoading, items, renderItem, emptyTitle, emptyDescription, className }) {
  return (
    <SectionCard title={title} icon={icon} className={className}>
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : items.length ? (
        <div className="grid gap-4 lg:grid-cols-2">{items.map(renderItem)}</div>
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </SectionCard>
  );
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: () => jobsApi.list({}) });
  const trades = useQuery({ queryKey: ["trades"], queryFn: () => tradesApi.list({}) });
  const pulse = useQuery({ queryKey: ["pulse"], queryFn: () => pulseApi.list({}) });
  const notifications = useQuery({ queryKey: ["notifications"], queryFn: notificationApi.list, enabled: Boolean(user) });

  const criticalAlert = pulse.data?.find((item) => item.priority === "CRITICAL");

  return (
    <div className="space-y-6">
      <HeroPanel user={user} criticalAlert={criticalAlert} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={ShieldCheck} label="Trust Score" value={user?.reputationScore || 0} detail={`${user?.trustRank || "New"} standing`} />
        <MetricCard icon={BriefcaseBusiness} label="Completed Jobs" value={user?.completedJobsCount || 0} detail="Verified task completions" />
        <MetricCard icon={HeartHandshake} label="Successful Trades" value={user?.successfulTradesCount || 0} detail="Confirmed exchanges" />
        <MetricCard icon={BellRing} label="Unread Notifications" value={notifications.data?.filter((item) => !item.readAt).length || 0} detail="Cross-module alerts" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <FeedSection
            title="Jobs"
            icon={BriefcaseBusiness}
            isLoading={jobs.isLoading}
            items={jobs.data?.slice(0, 2) || []}
            renderItem={(job) => <JobCard key={job._id} job={job} />}
            emptyTitle="No jobs yet"
            emptyDescription="New work opportunities will appear here once jobs are available."
          />
          <FeedSection
            title="Trades"
            icon={HeartHandshake}
            isLoading={trades.isLoading}
            items={trades.data?.slice(0, 2) || []}
            renderItem={(trade) => <TradeCard key={trade._id} trade={trade} />}
            emptyTitle="No trades yet"
            emptyDescription="Trade listings and exchange requests will appear here when they are available."
          />
          <SectorMap />
          {user?.recentActivity?.length ? (
            <ActivityTimeline items={user.recentActivity} />
          ) : (
            <EmptyState title="No recent activity yet" description="Your dashboard will start logging reputation shifts, negotiations, and lifecycle actions as you use the terminal." />
          )}
        </div>
        <div className="space-y-6">
          <SectionCard title="Assistant" icon={Bot}>
            <AssistantPanel jobs={jobs.data} pulse={pulse.data} />
          </SectionCard>
          <SectionCard title="Pulse" icon={Newspaper}>
            {pulse.isLoading ? (
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)}
              </div>
            ) : pulse.data?.length ? (
              <div className="grid gap-4">
                {pulse.data.slice(0, 3).map((post) => <PulseCard key={post._id} post={post} />)}
              </div>
            ) : (
              <EmptyState title="No Pulse updates yet" description="Alerts and city intelligence will appear here when new updates are published." />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
