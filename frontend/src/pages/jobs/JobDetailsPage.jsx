import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { jobsApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { Button } from "../../components/shared/Button";
import { formatCurrency, formatDate, formatStatusLabel } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";

const lifecycle = ["POSTED", "APPLIED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "VERIFIED"];

export function JobDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [applicationForm, setApplicationForm] = useState({ message: "", expectedPrice: "", availability: "" });
  const [disputeReason, setDisputeReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const { data } = useQuery({ queryKey: ["job", id], queryFn: () => jobsApi.detail(id) });

  const applyMutation = useMutation({
    mutationFn: (payload) => jobsApi.apply(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["job", id] })
  });
  const statusMutation = useMutation({
    mutationFn: (payload) => jobsApi.updateStatus(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["job", id] })
  });
  const disputeMutation = useMutation({
    mutationFn: (payload) => jobsApi.dispute(id, payload),
    onSuccess: () => {
      setDisputeReason("");
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    }
  });
  const decisionMutation = useMutation({
    mutationFn: ({ applicationId, payload }) => jobsApi.decideApplication(id, applicationId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["job", id] })
  });
  const cancelMutation = useMutation({
    mutationFn: (payload) => jobsApi.cancel(id, payload),
    onSuccess: () => {
      setCancelReason("");
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    }
  });

  if (!data) return null;

  const isOwner = user?._id === data.postedBy?._id;
  const isWorker = user?._id === data.selectedWorker?._id;
  const isAdmin = user?.role === "admin";
  const activeIndex = lifecycle.indexOf(data.status);
  const isLocked = ["CANCELLED", "DISPUTED", "VERIFIED"].includes(data.status);
  const canCancel =
    isAdmin ||
    (isOwner && data.status !== "VERIFIED" && data.status !== "COMPLETED") ||
    (isWorker && ["ASSIGNED", "IN_PROGRESS"].includes(data.status));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
      <div className="space-y-6">
        <Panel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-semibold">{data.title}</div>
              <div className="mt-2 text-sm text-slate-400">
                {formatStatusLabel(data.category)} / {data.locationMode} / {data.locationText || data.sector || "Neo-Jamshedpur"}
              </div>
            </div>
            <StatusBadge value={data.status} />
          </div>
          <div className="mt-6 text-sm leading-7 text-slate-300">{data.description}</div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">Budget: {formatCurrency(data.budget)} ({data.budgetType})</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">Deadline: {formatDate(data.deadline)}</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">Urgency: {formatStatusLabel(data.urgency)}</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">Skills: {data.requiredSkills?.join(", ") || "None specified"}</div>
          </div>
          <div className="mt-6">
            <div className="mb-3 text-sm font-semibold text-white">Lifecycle progress</div>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
              {lifecycle.map((step, index) => (
                <div key={step} className={`min-w-0 break-words rounded-2xl border px-3 py-3 text-center text-[10px] uppercase tracking-[0.18em] ${index <= activeIndex ? "border-cyber/30 bg-cyber/10 text-cyber" : "border-white/10 bg-black/20 text-slate-500"}`}>
                  {formatStatusLabel(step)}
                </div>
              ))}
            </div>
          </div>
          {data.status === "CANCELLED" ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Cancellation record</div>
              <div className="mt-2 text-sm text-slate-300">
                {data.cancellationType} at {data.cancellationStage}.
              </div>
              <div className="mt-2 text-sm text-slate-400">Reason: {data.cancellationReason}</div>
              <div className="mt-2 text-xs text-slate-500">
                Cancelled by {data.cancelledBy?.fullName || "system"} on {formatDate(data.cancelledAt)}
              </div>
            </div>
          ) : null}
        </Panel>

        {!isOwner && !isLocked ? (
          <Panel>
            <div className="text-lg font-semibold">Apply for this task</div>
            <div className="mt-4 grid gap-3">
              <textarea className="min-h-28 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={applicationForm.message} onChange={(event) => setApplicationForm((current) => ({ ...current, message: event.target.value }))} placeholder="Why are you a good fit?" />
              <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" type="number" value={applicationForm.expectedPrice} onChange={(event) => setApplicationForm((current) => ({ ...current, expectedPrice: event.target.value }))} placeholder="Expected price" />
              <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={applicationForm.availability} onChange={(event) => setApplicationForm((current) => ({ ...current, availability: event.target.value }))} placeholder="Availability" />
            </div>
            {applyMutation.error ? <div className="mt-3 text-sm text-danger">{applyMutation.error.response?.data?.message || "Application failed."}</div> : null}
            <Button className="mt-4" onClick={() => applyMutation.mutate({ ...applicationForm, expectedPrice: Number(applicationForm.expectedPrice) })}>
              {applyMutation.isPending ? "Applying..." : "Submit application"}
            </Button>
          </Panel>
        ) : null}

        {(isOwner || isWorker) && data.status !== "VERIFIED" && data.status !== "DISPUTED" && data.status !== "CANCELLED" ? (
          <Panel>
            <div className="text-lg font-semibold">Progress controls</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {isWorker && data.status === "ASSIGNED" ? <Button onClick={() => statusMutation.mutate({ status: "IN_PROGRESS", note: "Worker started the task" })}>Start work</Button> : null}
              {isWorker && data.status === "IN_PROGRESS" ? <Button onClick={() => statusMutation.mutate({ status: "COMPLETED", note: "Worker marked the task completed" })}>Mark completed</Button> : null}
              {isOwner && data.status === "COMPLETED" ? <Button onClick={() => statusMutation.mutate({ status: "VERIFIED", note: "Owner verified successful completion" })}>Verify completion</Button> : null}
            </div>
          </Panel>
        ) : null}

        {canCancel && data.status !== "CANCELLED" ? (
          <Panel>
            <div className="text-lg font-semibold">Cancel task</div>
            <div className="mt-2 text-sm text-slate-400">
              Owners can cancel before verification, workers can cancel after assignment or during early progress, and admins can cancel at any stage.
            </div>
            <textarea
              className="mt-4 min-h-24 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              placeholder="Cancellation reason"
            />
            {cancelMutation.error ? <div className="mt-3 text-sm text-danger">{cancelMutation.error.response?.data?.message || "Cancellation failed."}</div> : null}
            <Button className="mt-4" variant="danger" onClick={() => cancelMutation.mutate({ reason: cancelReason })}>
              {cancelMutation.isPending ? "Cancelling..." : "Cancel job"}
            </Button>
          </Panel>
        ) : null}
      </div>

      <div className="space-y-6">
        <Panel>
          <div className="text-lg font-semibold">Applications</div>
          <div className="mt-4 space-y-4">
            {data.applicants?.map((application) => (
              <div key={application._id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{application.applicant?.fullName}</div>
                    <div className="mt-1 text-sm text-slate-400">{application.pitch}</div>
                    <div className="mt-2 text-xs text-slate-500">Expected {application.expectedPrice || application.proposedBudget ? formatCurrency(application.expectedPrice || application.proposedBudget) : "N/A"}</div>
                  </div>
                  <StatusBadge value={application.status} />
                </div>
                {isOwner && !isLocked && data.status !== "ASSIGNED" && application.status !== "REJECTED" ? (
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => decisionMutation.mutate({ applicationId: application._id, payload: { decision: "ACCEPTED" } })}>Accept</Button>
                    <Button variant="ghost" onClick={() => decisionMutation.mutate({ applicationId: application._id, payload: { decision: "REJECTED", reason: "Not selected for this task" } })}>Reject</Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="text-lg font-semibold">Lifecycle log</div>
          <div className="mt-4 space-y-4">
            {data.logs?.map((log) => (
              <div key={log._id} className="border-l border-cyber/20 pl-4">
                <div className="text-sm text-white">{formatStatusLabel(log.toStatus)}</div>
                {log.note ? <div className="mt-1 text-sm text-slate-400">{log.note}</div> : null}
                <div className="text-xs text-slate-500">{formatDate(log.createdAt)}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="text-lg font-semibold">Raise dispute</div>
          <textarea className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={disputeReason} onChange={(event) => setDisputeReason(event.target.value)} placeholder="Explain the issue clearly" />
          {disputeMutation.error ? <div className="mt-3 text-sm text-danger">{disputeMutation.error.response?.data?.message || "Could not raise dispute."}</div> : null}
          <Button className="mt-4" variant="danger" disabled={isLocked} onClick={() => disputeMutation.mutate({ reason: disputeReason })}>
            {disputeMutation.isPending ? "Opening dispute..." : "Raise dispute"}
          </Button>
        </Panel>
      </div>
    </div>
  );
}
