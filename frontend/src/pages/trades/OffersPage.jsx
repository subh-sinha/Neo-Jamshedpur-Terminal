import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { tradesApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { Button } from "../../components/shared/Button";
import { useAuthStore } from "../../store/authStore";
import { formatDate } from "../../lib/utils";
import { StatusBadge } from "../../components/shared/StatusBadge";

export function OffersPage() {
  const { id, offerId } = useParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [replyForm, setReplyForm] = useState({ message: "", offeredValue: "" });
  const { data: trade } = useQuery({ queryKey: ["trade", id], queryFn: () => tradesApi.detail(id) });
  const { data: offer } = useQuery({
    queryKey: ["trade-offer", id, offerId],
    queryFn: () => tradesApi.getOffer(id, offerId),
    enabled: Boolean(id && offerId)
  });

  const counterMutation = useMutation({
    mutationFn: (payload) => tradesApi.counterOffer(id, offerId, payload),
    onSuccess: () => {
      setReplyForm({ message: "", offeredValue: "" });
      queryClient.invalidateQueries({ queryKey: ["trade-offer", id, offerId] });
      queryClient.invalidateQueries({ queryKey: ["trade", id] });
    }
  });

  const acceptMutation = useMutation({
    mutationFn: () => tradesApi.acceptOffer(id, offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trade", id] });
      queryClient.invalidateQueries({ queryKey: ["trade-offer", id, offerId] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: () => tradesApi.rejectOffer(id, offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trade", id] });
      queryClient.invalidateQueries({ queryKey: ["trade-offer", id, offerId] });
    }
  });

  const isOwner = user?._id === trade?.owner?._id;
  const otherPartyName = isOwner ? offer?.proposer?.fullName : trade?.owner?.fullName;

  function getSenderLabel(authorId) {
    if (String(authorId) === String(user?._id)) return "You";
    if (String(authorId) === String(offer?.proposer?._id || offer?.proposer)) {
      return offer?.proposer?.fullName || "Other user";
    }
    if (String(authorId) === String(trade?.owner?._id || trade?.owner)) {
      return trade?.owner?.fullName || "Other user";
    }
    return otherPartyName || "Other user";
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Panel>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">Negotiation thread</div>
            <div className="mt-1 text-sm text-slate-400">
              Chatting with {otherPartyName || "trade participant"} about <span className="text-white">{trade?.title}</span>
            </div>
          </div>
          <StatusBadge value={offer?.status || trade?.status} />
        </div>

        <div className="mt-6 space-y-4">
          {offer?.thread?.map((entry, index) => {
            const mine = String(entry.author) === String(user?._id);
            const senderLabel = getSenderLabel(entry.author);
            return (
              <div key={`${entry.createdAt}-${index}`} className={`flex w-full ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`w-full max-w-xl rounded-3xl border px-4 py-3 ${
                    mine
                      ? "ml-12 border-cyber/30 bg-cyber/10 text-right"
                      : "mr-12 border-white/10 bg-black/20 text-left"
                  }`}
                >
                  <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${mine ? "text-cyber" : "text-slate-400"}`}>
                    {senderLabel}
                  </div>
                  <div className="text-sm text-white">{entry.message}</div>
                  {entry.offeredValue ? (
                    <div className="mt-2 rounded-2xl bg-black/20 px-3 py-2 text-sm text-cyber">Offer value: {entry.offeredValue}</div>
                  ) : null}
                  {entry.createdAt ? <div className="mt-2 text-xs text-slate-500">{formatDate(entry.createdAt)}</div> : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4">
          <div className="text-sm font-semibold text-white">Send message / counter-offer</div>
          <div className="mt-3 grid gap-3">
            <input
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none"
              placeholder="Optional new offer value"
              value={replyForm.offeredValue}
              onChange={(event) => setReplyForm((current) => ({ ...current, offeredValue: event.target.value }))}
            />
            <textarea
              className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none"
              placeholder="Type your negotiation message"
              value={replyForm.message}
              onChange={(event) => setReplyForm((current) => ({ ...current, message: event.target.value }))}
            />
          </div>
          {counterMutation.error ? <div className="mt-3 text-sm text-danger">{counterMutation.error.response?.data?.message || "Message failed to send."}</div> : null}
          <Button className="mt-4" onClick={() => counterMutation.mutate(replyForm)}>
            {counterMutation.isPending ? "Sending..." : "Send message"}
          </Button>
        </div>
      </Panel>

      <Panel>
        <div className="text-lg font-semibold">Negotiation controls</div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-sm text-slate-400">Current offer</div>
          <div className="mt-2 text-lg font-semibold text-cyber">{offer?.offeredValue || "N/A"}</div>
        </div>
        {isOwner ? (
          <div className="mt-4 space-y-3">
            <Button className="w-full" onClick={() => acceptMutation.mutate()}>
              {acceptMutation.isPending ? "Accepting..." : "Accept offer"}
            </Button>
            <Button className="w-full" variant="ghost" onClick={() => rejectMutation.mutate()}>
              {rejectMutation.isPending ? "Rejecting..." : "Reject offer"}
            </Button>
          </div>
        ) : null}
        <Link to={`/trades/${id}`} className="mt-6 block text-sm text-cyber">
          Back to trade details
        </Link>
      </Panel>
    </div>
  );
}
