import { ArrowRightLeft, ImageIcon, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Panel } from "../shared/Panel";
import { StatusBadge } from "../shared/StatusBadge";
import { getTradePreviewImage } from "../../lib/tradeVisuals";
import { formatTradeExchange } from "../../lib/utils";

export function TradeCard({ trade }) {
  const previewImage = getTradePreviewImage(trade);

  return (
    <Link to={`/trades/${trade._id}`}>
      <Panel className="h-full transition hover:-translate-y-1 hover:shadow-glow">
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          {previewImage ? (
            <img src={previewImage} alt={trade.title} className="h-44 w-full object-cover" />
          ) : (
            <div className="flex h-44 items-center justify-center gap-2 bg-[radial-gradient(circle_at_center,rgba(54,241,255,0.14),transparent_48%)] text-xs uppercase tracking-[0.28em] text-cyber/70">
              <ImageIcon size={16} />
              No image uplink
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <ArrowRightLeft size={16} className="text-cyber" />
              {trade.title}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Tag size={14} />
                {trade.category}
              </span>
              <span>{trade.itemType}</span>
            </div>
          </div>
          <StatusBadge value={trade.status} />
        </div>
        <div className="mt-4 text-sm text-slate-300">{trade.description}</div>
        <div className="mt-5 text-sm text-cyber">Seeking: {formatTradeExchange(trade.expectedExchange)}</div>
      </Panel>
    </Link>
  );
}
