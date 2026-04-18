import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, Bookmark, Eye, Heart, Radio, ShieldPlus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { pulseApi } from "../../api/services";
import { Panel } from "../shared/Panel";
import { StatusBadge } from "../shared/StatusBadge";
import { cn, formatCompactDate, formatStatusLabel } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";

const priorityStyles = {
  CRITICAL: "border-danger/40 bg-danger/10 shadow-danger",
  HIGH: "border-ember/30 bg-ember/10",
  NORMAL: "border-white/10 bg-white/5"
};

export function PulseCard({ post }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [activeReaction, setActiveReaction] = useState(null);
  const [saved, setSaved] = useState(Boolean(post.bookmarked));
  const previewMedia = post.media?.[0];
  const reactMutation = useMutation({
    mutationFn: (payload) => pulseApi.react(post._id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse"] });
      queryClient.invalidateQueries({ queryKey: ["pulse", post._id] });
    }
  });
  const bookmarkMutation = useMutation({
    mutationFn: () => pulseApi.bookmark(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse"] });
      queryClient.invalidateQueries({ queryKey: ["pulse", post._id] });
    }
  });

  useEffect(() => {
    setActiveReaction(null);
    setSaved(Boolean(post.bookmarked));
  }, [post._id, post.bookmarked]);

  function handleReaction(type) {
    setActiveReaction(type);
    reactMutation.mutate({ type });
  }

  function handleBookmark() {
    setSaved((current) => !current);
    bookmarkMutation.mutate(undefined, {
      onError: () => setSaved((current) => !current)
    });
  }

  return (
    <Panel className={`h-full transition hover:-translate-y-1 hover:shadow-glow ${priorityStyles[post.priority] || ""}`}>
      <Link to={`/pulse/${post._id}`} className="group block cursor-pointer" aria-label={`Open ${post.title}`}>
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
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-cyber transition group-hover:text-white">
          Read full post
          <ArrowRight size={14} />
        </div>
      </Link>
      {user ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => handleReaction("signal")}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-cyber/30 hover:text-white",
              activeReaction === "signal" && "border-cyber/50 bg-cyber/15 text-white shadow-glow"
            )}
          >
            <Sparkles size={14} className={activeReaction === "signal" ? "text-cyber" : ""} />
            Like
          </button>
          <button
            type="button"
            onClick={() => handleReaction("support")}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-cyber/30 hover:text-white",
              activeReaction === "support" && "border-cyber/50 bg-cyber/15 text-white shadow-glow"
            )}
          >
            <ShieldPlus size={14} className={activeReaction === "support" ? "text-cyber" : ""} />
            Support
          </button>
          <button
            type="button"
            onClick={handleBookmark}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-cyber/30 hover:text-white",
              saved && "border-cyber/50 bg-cyber/15 text-white shadow-glow"
            )}
          >
            <Bookmark size={14} className={saved ? "fill-cyber text-cyber" : ""} />
            Save
          </button>
        </div>
      ) : null}
    </Panel>
  );
}
