import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { pulseApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { Button } from "../../components/shared/Button";
import { useAuthStore } from "../../store/authStore";

export function PulseCreatePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const canPostHigh = user?.role === "admin" || user?.role === "provider" || user?.verificationStatus === "verified";
  const canPostCritical = user?.role === "admin";
  const categoryOptions = user?.role === "citizen"
    ? ["COMMUNITY", "EVENT", "TREND"]
    : ["ALERT", "INFRASTRUCTURE", "EVENT", "COMMUNITY", "TREND", "SAFETY"];
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: user?.role === "citizen" ? "COMMUNITY" : "ALERT",
    priority: "NORMAL",
    location: "",
    mediaUrl: "",
    mediaType: "image"
  });
  const mutation = useMutation({
    mutationFn: pulseApi.create,
    onSuccess: (data) => navigate(`/pulse/${data._id}`)
  });

  return (
    <Panel>
      <div className="text-xl font-semibold">Create Pulse update</div>
      <div className="mt-2 text-sm text-slate-400">Admin can post all alert levels, verified users can publish trusted updates, and citizens are constrained to community-safe publishing.</div>
      <div className="mt-4 grid gap-4">
        {["title", "summary", "content", "location"].map((field) => (
          <input
            key={field}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            value={form[field]}
            onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
            placeholder={field}
          />
        ))}
        <div className="grid gap-4 md:grid-cols-2">
          <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
            {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}>
            <option value="NORMAL">Normal</option>
            {canPostHigh ? <option value="HIGH">High</option> : null}
            {canPostCritical ? <option value="CRITICAL">Critical</option> : null}
          </select>
          <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none md:col-span-2" value={form.mediaUrl} onChange={(event) => setForm((current) => ({ ...current, mediaUrl: event.target.value }))} placeholder="Media URL (optional)" />
        </div>
      </div>
      {user?.role === "citizen" ? <div className="mt-4 text-xs text-slate-500">Citizen accounts can publish community-safe updates and normal priority posts.</div> : null}
      {mutation.error ? <div className="mt-4 text-sm text-danger">{mutation.error.response?.data?.message || "Could not publish Pulse update."}</div> : null}
      <Button
        className="mt-6"
        onClick={() =>
          mutation.mutate({
            ...form,
            media: form.mediaUrl ? [{ url: form.mediaUrl, type: form.mediaType }] : []
          })
        }
      >
        Publish update
      </Button>
    </Panel>
  );
}
