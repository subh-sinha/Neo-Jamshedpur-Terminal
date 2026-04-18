import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { formatCurrency, formatDate } from "../../lib/utils";

export function MyApplicationsPage() {
  const { data = [] } = useQuery({ queryKey: ["my-applications"], queryFn: jobsApi.myApplications });
  return (
    <Panel>
      <div className="text-xl font-semibold">My applications</div>
      <div className="mt-4 space-y-4">
        {data.map((item) => (
          <div key={item._id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{item.job?.title}</div>
                <div className="mt-1 text-sm text-slate-400">{item.pitch}</div>
                <div className="mt-2 text-xs text-slate-500">Expected {item.expectedPrice || item.proposedBudget ? formatCurrency(item.expectedPrice || item.proposedBudget) : "N/A"} · {formatDate(item.createdAt)}</div>
              </div>
              <StatusBadge value={item.status} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
