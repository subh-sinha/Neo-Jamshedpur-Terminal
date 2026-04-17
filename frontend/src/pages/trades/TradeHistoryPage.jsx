import { useQuery } from "@tanstack/react-query";
import { tradesApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { formatDate } from "../../lib/utils";

export function TradeHistoryPage() {
  const { data = [] } = useQuery({ queryKey: ["trade-history"], queryFn: tradesApi.history });
  return (
    <Panel>
      <div className="text-xl font-semibold">Trade history</div>
      <div className="mt-4 space-y-4">
        {data.map((entry) => (
          <div key={entry._id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="font-semibold">{entry.action.replaceAll("_", " ")}</div>
            <div className="mt-1 text-sm text-slate-400">{entry.trade?.title}</div>
            <div className="mt-2 text-xs text-slate-500">{formatDate(entry.createdAt)}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
