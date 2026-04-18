import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { Button } from "../../components/shared/Button";

export function ManageUsersPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.users });
  const verifyMutation = useMutation({
    mutationFn: adminApi.verifyUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] })
  });
  return (
    <Panel>
      <div className="text-xl font-semibold">Manage users</div>
      <div className="mt-4 space-y-4">
        {data.map((user) => (
          <div key={user._id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{user.fullName}</div>
                  <div className="text-sm text-slate-400">@{user.username}</div>
                  <div className="mt-1 text-xs text-slate-500">{user.email}</div>
                </div>
              <div className="flex items-center gap-2">
                <StatusBadge value={user.verificationStatus} />
                <StatusBadge value={user.role} />
              </div>
            </div>
            {user.role === "citizen" && user.verificationStatus === "pending" ? (
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm text-slate-400">This citizen requested provider verification.</div>
                <Button
                  onClick={() => verifyMutation.mutate(user._id)}
                  disabled={verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? "Approving..." : "Approve provider"}
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Panel>
  );
}
