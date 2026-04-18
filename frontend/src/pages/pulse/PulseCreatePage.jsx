import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { pulseApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { Button } from "../../components/shared/Button";
import { useAuthStore } from "../../store/authStore";

export function PulseCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const canPostHigh = !user || user.role === "admin" || user.role === "provider" || user.verificationStatus === "verified";
  const canPostCritical = !user || user.role === "admin";
  const categoryOptions = ["ALERT", "INFRASTRUCTURE", "EVENT", "COMMUNITY", "TREND", "SAFETY"];
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: "ALERT",
    priority: "NORMAL",
    location: "",
    mediaUrl: "",
    mediaType: "image"
  });

  useEffect(() => {
    if (user?.role === "citizen") {
      setForm((current) => ({
        ...current,
        category: current.category || "COMMUNITY",
        priority: current.priority === "CRITICAL" || current.priority === "HIGH" ? "NORMAL" : current.priority
      }));
    }
  }, [user]);
  const mutation = useMutation({
    mutationFn: pulseApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pulse"] });
      queryClient.invalidateQueries({ queryKey: ["global-critical-pulse"] });
      navigate(`/pulse/${data._id}`);
    }
  });

  return (
    <Panel>
      <div className="text-xl font-semibold">Create Pulse update</div>
      <div className="mt-2 text-sm text-slate-400">Admin can post all alert levels, verified users can publish trusted updates, and citizens can still draft updates but restricted priorities will be enforced server-side.</div>
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
            <option value="HIGH" disabled={!canPostHigh}>High{canPostHigh ? "" : " (verified only)"}</option>
            <option value="CRITICAL" disabled={!canPostCritical}>Critical{canPostCritical ? "" : " (admin only)"}</option>
          </select>
          <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none md:col-span-2" value={form.mediaUrl} onChange={(event) => setForm((current) => ({ ...current, mediaUrl: event.target.value }))} placeholder="Media URL (optional)" />
        </div>
      </div>
      {user?.role === "citizen" ? <div className="mt-4 text-xs text-slate-500">Citizen accounts can safely publish normal updates. High and critical priorities remain restricted.</div> : null}
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
