import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { authApi } from "../api/services";
import { useAuthStore } from "../store/authStore";
import { Panel } from "../components/shared/Panel";
import { Button } from "../components/shared/Button";
import { StatusBadge } from "../components/shared/StatusBadge";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const hydrateUser = useAuthStore((state) => state.hydrateUser);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    sector: user?.sector || "",
    avatar: user?.avatar || "",
    phone: user?.phone || ""
  });

  const mutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: hydrateUser
  });
  const providerRequestMutation = useMutation({
    mutationFn: authApi.requestProvider,
    onSuccess: hydrateUser
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Panel>
        <img src={user?.avatar} alt={user?.fullName} className="h-28 w-28 rounded-3xl border border-white/10 bg-black/30 object-cover" />
        <div className="mt-4 text-2xl font-semibold">{user?.fullName}</div>
        <div className="mt-1 text-sm text-slate-400">@{user?.username}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge value={user?.trustRank} />
          <StatusBadge value={user?.verificationStatus} />
          <StatusBadge value={user?.role} />
        </div>
        <div className="mt-6 space-y-2 text-sm text-slate-300">
          <div>Email: {user?.email}</div>
          <div>Sector: {user?.sector}</div>
          <div>Jobs completed: {user?.completedJobsCount}</div>
          <div>Trades completed: {user?.successfulTradesCount}</div>
          <div>Disputes: {user?.disputesCount}</div>
        </div>
        {user?.role === "citizen" && user?.verificationStatus !== "verified" ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-semibold text-white">Become a provider</div>
            <div className="mt-2 text-sm text-slate-400">
              Send a verification request so an admin can review your account and upgrade you to provider status.
            </div>
            {providerRequestMutation.error ? (
              <div className="mt-3 text-sm text-danger">
                {providerRequestMutation.error.response?.data?.message || "Could not submit provider request."}
              </div>
            ) : null}
            <Button
              className="mt-4"
              onClick={() => providerRequestMutation.mutate()}
              disabled={providerRequestMutation.isPending || user?.verificationStatus === "pending"}
            >
              {user?.verificationStatus === "pending"
                ? "Request pending"
                : providerRequestMutation.isPending
                  ? "Submitting request..."
                  : "Request provider verification"}
            </Button>
          </div>
        ) : null}
      </Panel>
      <Panel>
        <div className="mb-4 text-xl font-semibold">Edit profile</div>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(form).map(([field, value]) => (
            <input
              key={field}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              value={value}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              placeholder={field}
            />
          ))}
        </div>
        <Button className="mt-6" onClick={() => mutation.mutate(form)}>
          {mutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </Panel>
    </div>
  );
}
