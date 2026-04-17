import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { jobsApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { Button } from "../../components/shared/Button";

const categories = [
  { value: "service", label: "Service" },
  { value: "freelance", label: "Freelance" },
  { value: "local", label: "Local" },
  { value: "community", label: "Community" },
  { value: "urgent", label: "Urgent tasks" }
];

export function JobFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "service",
    requiredSkills: "",
    budget: 0,
    budgetType: "fixed",
    deadline: "",
    urgency: "medium",
    locationMode: "onsite",
    locationText: "",
    sector: ""
  });

  const mutation = useMutation({
    mutationFn: jobsApi.create,
    onSuccess: (data) => navigate(`/jobs/${data._id}`)
  });

  const submit = () =>
    mutation.mutate({
      ...form,
      budget: Number(form.budget),
      requiredSkills: form.requiredSkills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    });

  return (
    <Panel>
      <div className="text-xl font-semibold">Post a new city task</div>
      <div className="mt-2 text-sm text-slate-400">Create a realistic marketplace listing with skills, urgency, deadline, and location context.</div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Task title" />
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
          {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
        </select>
        <textarea className="min-h-32 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none md:col-span-2" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Detailed description" />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.requiredSkills} onChange={(event) => setForm((current) => ({ ...current, requiredSkills: event.target.value }))} placeholder="Required skills, comma separated" />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" type="number" value={form.budget} onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))} placeholder="Budget" />
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.budgetType} onChange={(event) => setForm((current) => ({ ...current, budgetType: event.target.value }))}>
          <option value="fixed">Fixed budget</option>
          <option value="negotiable">Negotiable</option>
        </select>
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" type="datetime-local" value={form.deadline} onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))} />
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.urgency} onChange={(event) => setForm((current) => ({ ...current, urgency: event.target.value }))}>
          <option value="low">Low urgency</option>
          <option value="medium">Medium urgency</option>
          <option value="high">High urgency</option>
          <option value="critical">Critical urgency</option>
        </select>
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.locationMode} onChange={(event) => setForm((current) => ({ ...current, locationMode: event.target.value }))}>
          <option value="onsite">Onsite</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.locationText} onChange={(event) => setForm((current) => ({ ...current, locationText: event.target.value }))} placeholder="Location details" />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.sector} onChange={(event) => setForm((current) => ({ ...current, sector: event.target.value }))} placeholder="Sector / zone" />
      </div>
      {mutation.error ? <div className="mt-4 text-sm text-danger">{mutation.error.response?.data?.message || "Could not publish job."}</div> : null}
      <Button className="mt-6" onClick={submit}>
        {mutation.isPending ? "Publishing..." : "Publish listing"}
      </Button>
    </Panel>
  );
}
