import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "../../api/services";
import { JobCard } from "../../components/jobs/JobCard";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { MetricCard } from "../../components/shared/MetricCard";
import { Panel } from "../../components/shared/Panel";
import { StatusBadge } from "../../components/shared/StatusBadge";

export function MyJobsPage() {
  const { data } = useQuery({ queryKey: ["my-jobs"], queryFn: jobsApi.myJobs });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="My Work Board" title="Posted jobs and incoming applications" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Jobs" value={data?.stats?.total || 0} detail="All posted listings" />
        <MetricCard label="Active" value={data?.stats?.active || 0} detail="Open or ongoing tasks" />
        <MetricCard label="Completed" value={data?.stats?.completed || 0} detail="Finished and verified jobs" />
        <MetricCard label="Disputed" value={data?.stats?.disputed || 0} detail="Needs intervention" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {data?.jobs?.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
        <Panel>
          <div className="text-lg font-semibold">Recent applications</div>
          <div className="mt-4 space-y-4">
            {data?.applications?.slice(0, 8).map((application) => (
              <div key={application._id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{application.applicant?.fullName}</div>
                    <div className="mt-1 text-sm text-slate-400">{application.pitch}</div>
                  </div>
                  <StatusBadge value={application.status} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
