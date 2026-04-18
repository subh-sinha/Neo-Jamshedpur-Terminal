import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "../api/services";
import { Panel } from "../components/shared/Panel";
import { Button } from "../components/shared/Button";
import { StatusBadge } from "../components/shared/StatusBadge";
import { formatDate } from "../lib/utils";

export function NotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["notifications"], queryFn: notificationApi.list });
  const markOne = useMutation({
    mutationFn: notificationApi.read,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });
  const markAll = useMutation({
    mutationFn: notificationApi.readAll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xl font-semibold">Notification Center</div>
        <Button variant="ghost" onClick={() => markAll.mutate()}>
          Clear all
        </Button>
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <button
            key={item._id}
            type="button"
            onClick={async () => {
              if (!item.readAt) {
                await markOne.mutateAsync(item._id);
              }
              if (item.link) {
                navigate(item.link);
              }
            }}
            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-cyber/20 hover:bg-black/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="mt-1 text-sm text-slate-400">{item.message}</div>
              </div>
              <StatusBadge value={item.priority} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>{formatDate(item.createdAt)}</span>
              {item.link ? <span className="text-cyber">Open</span> : null}
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}
