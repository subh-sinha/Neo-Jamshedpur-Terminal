import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Panel } from "../shared/Panel";
import { StatusBadge } from "../shared/StatusBadge";
import { formatCompactDate, formatCurrency, formatStatusLabel } from "../../lib/utils";

const lifecycleSteps = ["POSTED", "APPLIED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "VERIFIED"];

export function JobCard({ job }) {
  const activeStep = lifecycleSteps.indexOf(job.status);
  const progress = activeStep >= 0 ? ((activeStep + 1) / lifecycleSteps.length) * 100 : 0;

  return (
    <Link to={`/jobs/${job._id}`}>
      <Panel className="h-full transition hover:-translate-y-1 hover:shadow-glow">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <BriefcaseBusiness size={16} className="text-cyber" />
              {job.title}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span>{formatStatusLabel(job.category)}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />
                {job.locationMode}
              </span>
              <span>{job.sector || job.locationText || "Neo-Jamshedpur"}</span>
            </div>
          </div>
          <StatusBadge value={job.status} />
        </div>
        <p className="mt-4 line-clamp-3 text-sm text-slate-300">{job.description}</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-cyber via-cobalt to-cyber" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{formatStatusLabel(job.status)}</div>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-cyber">{formatCurrency(job.budget)} {job.budgetType === "negotiable" ? " / negotiable" : ""}</span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <CalendarDays size={14} />
            Due {formatCompactDate(job.deadline)}
          </span>
        </div>
      </Panel>
    </Link>
  );
}
