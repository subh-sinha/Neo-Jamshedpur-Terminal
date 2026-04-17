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
    <Link to={`/pulse/${post._id}`}>
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
          <div>
            <div className="font-semibold">{post.title}</div>
            <div className="mt-2 text-sm text-slate-400">{formatStatusLabel(post.category)} / {post.author?.fullName || "System"}</div>
          </div>
          <StatusBadge value={post.priority} />
        </div>
        <div className="mt-4 text-sm text-slate-300">{post.summary}</div>
        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <span>{formatCompactDate(post.createdAt)}</span>
          <span>{post.reactionsCount || 0} reactions / {post.views || 0} views</span>
        </div>
      </Panel>
    </Link>
  );
}
