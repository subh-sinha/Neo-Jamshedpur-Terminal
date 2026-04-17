import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { StatusBadge } from "../../components/shared/StatusBadge";

export function ManageUsersPage() {
  const { data = [] } = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.users });
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
              </div>
              <StatusBadge value={user.role} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
