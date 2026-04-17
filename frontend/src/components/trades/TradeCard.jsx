import { Link } from "react-router-dom";
import { Panel } from "../shared/Panel";
import { StatusBadge } from "../shared/StatusBadge";

export function TradeCard({ trade }) {
  const previewImage = trade.images?.[0];

  return (
    <Link to={`/trades/${trade._id}`}>
      <Panel className="h-full transition hover:-translate-y-1 hover:shadow-glow">
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          {previewImage ? (
            <img src={previewImage} alt={trade.title} className="h-44 w-full object-cover" />
          ) : (
            <div className="flex h-44 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(54,241,255,0.14),transparent_48%)] text-xs uppercase tracking-[0.28em] text-cyber/70">
              No image uplink
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">{trade.title}</div>
            <div className="mt-2 text-sm text-slate-400">{trade.category} / {trade.itemType}</div>
          </div>
          <StatusBadge value={trade.status} />
        </div>
        <div className="mt-4 text-sm text-slate-300">{trade.description}</div>
        <div className="mt-5 text-sm text-cyber">Seeking: {trade.expectedExchange}</div>
      </Panel>
    </Link>
  );
}
