import { Eye, Radio, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Panel } from "../shared/Panel";
import { StatusBadge } from "../shared/StatusBadge";
import { formatCompactDate, formatStatusLabel } from "../../lib/utils";

const priorityStyles = {
  CRITICAL: "border-danger/40 bg-danger/10 shadow-danger",
  HIGH: "border-ember/30 bg-ember/10",
  NORMAL: "border-white/10 bg-white/5"
};

export function PulseCard({ post }) {
  const previewMedia = post.media?.[0];

  return (
    <Link to={`/pulse/${post._id}`} className="block h-full">
      <Panel className={`h-full transition hover:-translate-y-1 hover:shadow-glow ${priorityStyles[post.priority] || ""}`}>
        {previewMedia ? (
          <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            {previewMedia.type === "video" ? (
              <video src={previewMedia.url} className="h-44 w-full object-cover" muted />
            ) : (
              <img src={previewMedia.url} alt={post.title} className="h-44 w-full object-cover" />
            )}
          </div>
        ) : null}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2 font-semibold">
              <Radio size={16} className="text-cyber" />
              <span className="min-w-0 break-words">{post.title}</span>
            </div>
            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-3 break-words text-sm text-slate-400">
              <span>{formatStatusLabel(post.category)}</span>
              <span className="break-words">{post.author?.fullName || "System"}</span>
            </div>
          </div>
          <StatusBadge value={post.priority} />
        </div>
        <div className="mt-4 break-words text-sm text-slate-300">{post.summary}</div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="shrink-0">{formatCompactDate(post.createdAt)}</span>
          <span className="inline-flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1"><Sparkles size={14} />{post.reactionsCount || 0}</span>
            <span className="inline-flex items-center gap-1"><Eye size={14} />{post.views || 0}</span>
          </span>
        </div>
      </Panel>
    </Link>
  );
}
