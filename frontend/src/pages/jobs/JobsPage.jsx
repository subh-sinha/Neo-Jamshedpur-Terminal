import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { jobsApi } from "../../api/services";
import { JobCard } from "../../components/jobs/JobCard";
import { Button } from "../../components/shared/Button";
import { SectionHeader } from "../../components/shared/SectionHeader";

export function JobsPage() {
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    urgency: "",
    status: "",
    locationMode: "",
    minBudget: "",
    maxBudget: ""
  });
  const { data = [] } = useQuery({ queryKey: ["jobs", filters], queryFn: () => jobsApi.list(filters) });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Employment Grid" title="City task marketplace" action={<Link to="/jobs/create"><Button>Post a job</Button></Link>} />
      <div className="panel grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none xl:col-span-2" value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))} placeholder="Search by title, skill, location" />
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
          <option value="">All categories</option>
          <option value="service">Service</option>
          <option value="freelance">Freelance</option>
          <option value="local">Local</option>
          <option value="community">Community</option>
          <option value="urgent">Urgent tasks</option>
        </select>
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={filters.urgency} onChange={(event) => setFilters((current) => ({ ...current, urgency: event.target.value }))}>
          <option value="">All urgency</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
          <option value="">All status</option>
          <option value="POSTED">Posted</option>
          <option value="APPLIED">Applied</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="VERIFIED">Verified</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="DISPUTED">Disputed</option>
        </select>
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={filters.locationMode} onChange={(event) => setFilters((current) => ({ ...current, locationMode: event.target.value }))}>
          <option value="">Any location mode</option>
          <option value="onsite">Onsite</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" type="number" value={filters.minBudget} onChange={(event) => setFilters((current) => ({ ...current, minBudget: event.target.value }))} placeholder="Min budget" />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" type="number" value={filters.maxBudget} onChange={(event) => setFilters((current) => ({ ...current, maxBudget: event.target.value }))} placeholder="Max budget" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((job) => <JobCard key={job._id} job={job} />)}
      </div>
    </div>
  );
}
