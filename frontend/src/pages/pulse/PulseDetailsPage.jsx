import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { pulseApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { Button } from "../../components/shared/Button";
import { formatDate, formatStatusLabel } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";

export function PulseDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["pulse", id],
    queryFn: () => pulseApi.detail(id),
    refetchInterval: 15000
  });

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
    onSuccess: () => navigate("/pulse")
  });

  if (!data) return null;

  const isOwner = user?._id === data.author?._id;
  const isAdmin = user?.role === "admin";

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
        <div className="mt-6 text-sm leading-7 text-slate-300">{data.content}</div>
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
            <Button onClick={() => reactMutation.mutate({ type: "signal" })}>Like</Button>
            <Button variant="ghost" onClick={() => reactMutation.mutate({ type: "support" })}>Support</Button>
            <Button variant="ghost" onClick={() => reactMutation.mutate({ type: "watching" })}>Alert</Button>
            <Button variant="ghost" onClick={() => bookmarkMutation.mutate()}>{data.bookmarked ? "Unsave" : "Save"}</Button>
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


