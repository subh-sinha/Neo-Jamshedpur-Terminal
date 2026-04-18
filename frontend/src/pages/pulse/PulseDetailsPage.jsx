import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Bookmark, ShieldPlus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pulseApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { Button } from "../../components/shared/Button";
import { cn, formatDate, formatStatusLabel } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";

export function PulseDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pulse", id],
    queryFn: () => pulseApi.detail(id),
    refetchInterval: 15000
  });
  const [activeReaction, setActiveReaction] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(Boolean(data?.bookmarked));
  }, [data?.bookmarked]);

  const reactMutation = useMutation({
    mutationFn: (payload) => pulseApi.react(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pulse", id] })
  });
  const bookmarkMutation = useMutation({
    mutationFn: () => pulseApi.bookmark(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pulse", id] })
  });
  const moderateMutation = useMutation({
    mutationFn: (payload) => pulseApi.moderate(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pulse", id] })
  });

  const deleteMutation = useMutation({
    mutationFn: () => pulseApi.delete(id),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["pulse", id] });
      await queryClient.invalidateQueries({ queryKey: ["pulse"] });
      navigate("/pulse");
    }
  });

  if (isLoading) {
    return (
      <Panel>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-2/3 rounded-full bg-white/10" />
          <div className="h-4 w-1/2 rounded-full bg-white/10" />
          <div className="h-24 rounded-3xl bg-white/5" />
          <div className="h-48 rounded-3xl bg-white/5" />
        </div>
      </Panel>
    );
  }

  if (isError || !data) {
    return (
      <Panel>
        <div className="text-lg font-semibold text-white">Post unavailable</div>
        <div className="mt-2 text-sm text-slate-400">We could not load the full Pulse post right now.</div>
      </Panel>
    );
  }

  const isOwner = user?._id === data.author?._id;
  const isAdmin = user?.role === "admin";

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
    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
      <Panel>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold">{data.title}</div>
            <div className="mt-2 text-sm text-slate-400">
              {formatStatusLabel(data.category)} / {data.author?.fullName} / {formatDate(data.createdAt)}
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge value={data.priority} />
            <StatusBadge value={data.verificationStatus} />
          </div>
        </div>
        <div className="mt-4 text-base text-slate-200">{data.summary}</div>
        <div className="mt-6 whitespace-pre-line break-words text-sm leading-7 text-slate-300">{data.content}</div>
        {data.media?.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {data.media.map((item, index) => (
              <div key={`${item.url}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                {item.type === "video" ? (
                  <video controls src={item.url} className="h-56 w-full object-cover" />
                ) : (
                  <img src={item.url} alt={data.title} className="h-56 w-full object-cover" />
                )}
              </div>
            ))}
          </div>
        ) : null}
      </Panel>
      <div className="space-y-6">
        <Panel>
          <div className="text-lg font-semibold">Engagement</div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">Views: {data.views}</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">Reactions: {data.reactionsCount}</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">Bookmarks: {data.bookmarksCount}</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">Location: {data.location || data.sector || "City-wide"}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyber/30 hover:text-white",
                activeReaction === "signal" && "border-cyber/50 bg-cyber/15 text-white shadow-glow"
              )}
              onClick={() => handleReaction("signal")}
            >
              <Sparkles size={16} className={activeReaction === "signal" ? "text-cyber" : ""} />
              Like
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyber/30 hover:text-white",
                activeReaction === "support" && "border-cyber/50 bg-cyber/15 text-white shadow-glow"
              )}
              onClick={() => handleReaction("support")}
            >
              <ShieldPlus size={16} className={activeReaction === "support" ? "text-cyber" : ""} />
              Support
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyber/30 hover:text-white",
                activeReaction === "watching" && "border-cyber/50 bg-cyber/15 text-white shadow-glow"
              )}
              onClick={() => handleReaction("watching")}
            >
              <Bell size={16} className={activeReaction === "watching" ? "text-cyber" : ""} />
              Alert
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyber/30 hover:text-white",
                saved && "border-cyber/50 bg-cyber/15 text-white shadow-glow"
              )}
              onClick={handleBookmark}
            >
              <Bookmark size={16} className={saved ? "fill-cyber text-cyber" : ""} />
              {saved ? "Unsave" : "Save"}
            </button>
          </div>
        </Panel>
        {user?.role === "admin" ? (
          <Panel>
            <div className="text-lg font-semibold">Moderation controls</div>
            <div className="mt-4 space-y-3">
              <Button onClick={() => moderateMutation.mutate({ verificationStatus: "VERIFIED" })}>Mark verified</Button>
              <Button variant="ghost" onClick={() => moderateMutation.mutate({ priority: "HIGH" })}>Escalate to high</Button>
              <Button variant="danger" onClick={() => moderateMutation.mutate({ priority: "CRITICAL", pinned: true })}>Escalate to critical</Button>
            </div>
          </Panel>
        ) : null}

        {isOwner || isAdmin ? (
          <Panel>
            <div className="text-lg font-semibold text-danger">Danger zone</div>
            <div className="mt-2 text-sm text-slate-400">Permanently delete this post.</div>
            {deleteMutation.error ? <div className="mt-3 text-sm text-danger">{deleteMutation.error.response?.data?.message || "Deletion failed."}</div> : null}
            <Button
              className="mt-4"
              variant="danger"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (window.confirm("Are you sure you want to permanently delete this pulse post?")) {
                  deleteMutation.mutate();
                }
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete post"}
            </Button>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}


