import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../api/services";
import { MetricCard } from "../../components/shared/MetricCard";
import { SectionHeader } from "../../components/shared/SectionHeader";

export function AdminDashboardPage() {
  const { data } = useQuery({ queryKey: ["admin-analytics"], queryFn: adminApi.analytics });
  return (
    <div>
      <SectionHeader eyebrow="Administrator Grid" title="System analytics and moderation overview" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Users" value={data?.users || 0} detail="Registered identities" />
        <MetricCard label="Jobs" value={data?.jobs || 0} detail="Tracked task listings" />
        <MetricCard label="Trades" value={data?.trades || 0} detail="Marketplace records" />
        <MetricCard label="Pulse Posts" value={data?.pulse || 0} detail="Official and community feed entries" />
        <MetricCard label="Disputes" value={data?.disputes || 0} detail="Moderation load" />
        <MetricCard label="Notifications" value={data?.notifications || 0} detail="Broadcast footprint" />
      </div>
    </div>
  );
}
