import { Panel } from "../shared/Panel";
import { formatDate } from "../../lib/utils";

export function ActivityTimeline({ items = [] }) {
  return (
    <Panel>
      <div className="mb-4 font-semibold">Recent Activity</div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="border-l border-cyber/20 pl-4">
            <div className="text-sm text-white">{item.summary || item.action}</div>
            <div className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
