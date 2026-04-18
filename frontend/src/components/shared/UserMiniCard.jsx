import { TrustBadge } from "./TrustBadge";

export function UserMiniCard({ user }) {
  if (!user) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-panel p-3">
      <img src={user.avatar} alt={user.fullName} className="h-12 w-12 rounded-full object-cover" />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-50">{user.fullName}</div>
        <div className="truncate text-xs text-slate-400">@{user.username}</div>
      </div>
      <TrustBadge value={user.trustRank} />
    </div>
  );
}
