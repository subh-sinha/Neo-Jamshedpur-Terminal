import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { tradesApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { formatDate, formatTradeExchange } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/shared/Button";
import { getTradePreviewImage } from "../../lib/tradeVisuals";

export function TradeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [offerForm, setOfferForm] = useState({ offeredValue: "", note: "" });
  const { data } = useQuery({ queryKey: ["trade", id], queryFn: () => tradesApi.detail(id) });

  const createOffer = useMutation({
    mutationFn: (payload) => tradesApi.createOffer(id, payload),
    onSuccess: (offer) => {
      queryClient.invalidateQueries({ queryKey: ["trade", id] });
      navigate(`/trades/${id}/offers/${offer._id}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => tradesApi.delete(id),
    onSuccess: () => navigate("/trades")
  });

  if (!data) return null;

  const isOwner = user?._id === data.owner?._id;
  const isAdmin = user?.role === "admin";
  const previewImage = getTradePreviewImage(data);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <Panel>
        <div className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
          {previewImage ? (
            <img src={previewImage} alt={data.title} className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(54,241,255,0.14),transparent_48%)] font-mono text-xs uppercase tracking-[0.32em] text-cyber/70">
              No trade image uploaded
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold">{data.title}</div>
            <div className="mt-2 text-sm text-slate-400">{data.category} / {data.itemType}</div>
          </div>
          <StatusBadge value={data.status} />
        </div>
        <div className="mt-5 text-sm text-slate-300">{data.description}</div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
            Expected exchange: <span className="text-cyber">{formatTradeExchange(data.expectedExchange)}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
            Seller: <span className="text-white">{data.owner?.fullName}</span>
            <div className="mt-1 text-xs text-slate-400">
              Trust {data.owner?.trustRank} / Score {data.owner?.reputationScore}
            </div>
          </div>
        </div>
        {!isOwner ? (
          <div className="mt-6 rounded-3xl border border-cyber/20 bg-cyber/5 p-5">
            <div className="text-lg font-semibold">Start negotiation with seller</div>
            <div className="mt-2 text-sm text-slate-400">Send your offer and open a dedicated trade chat thread with the seller.</div>
            <div className="mt-4 grid gap-3">
              <input
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                placeholder="Your offer value"
                value={offerForm.offeredValue}
                onChange={(event) => setOfferForm((current) => ({ ...current, offeredValue: event.target.value }))}
              />
              <textarea
                className="min-h-28 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                placeholder="Message for the seller"
                value={offerForm.note}
                onChange={(event) => setOfferForm((current) => ({ ...current, note: event.target.value }))}
              />
            </div>
            {createOffer.error ? (
              <div className="mt-3 text-sm text-danger">{createOffer.error.response?.data?.message || "Could not start negotiation."}</div>
            ) : null}
            <Button className="mt-4" onClick={() => createOffer.mutate(offerForm)}>
              {createOffer.isPending ? "Opening thread..." : "Message seller"}
            </Button>
          </div>
        ) : null}
        <div className="mt-6 space-y-3">
          {data.offers?.map((offer) => (
            <div key={offer._id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{offer.proposer?.fullName}</div>
                  <div className="mt-1 text-sm text-slate-400">{offer.offeredValue}</div>
                  <div className="mt-2 text-xs text-slate-500">{offer.thread?.length || 0} messages in thread</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge value={offer.status} />
                  <Link to={`/trades/${id}/offers/${offer._id}`} className="text-sm text-cyber">
                    Open chat
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <div className="text-lg font-semibold">Transaction history</div>
        <div className="mt-4 space-y-4">
          {data.history?.map((entry) => (
            <div key={entry._id} className="border-l border-cyber/20 pl-4">
              <div className="text-sm text-white">{entry.action.replaceAll("_", " ")}</div>
              <div className="text-xs text-slate-500">{formatDate(entry.createdAt)}</div>
            </div>
          ))}
        </div>
      </Panel>

      {isOwner || isAdmin ? (
        <Panel>
          <div className="text-lg font-semibold text-danger">Danger zone</div>
          <div className="mt-2 text-sm text-slate-400">Permanently delete this trade.</div>
          {deleteMutation.error ? <div className="mt-3 text-sm text-danger">{deleteMutation.error.response?.data?.message || "Deletion failed."}</div> : null}
          <Button
            className="mt-4"
            variant="danger"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (window.confirm("Are you sure you want to permanently delete this trade?")) {
                deleteMutation.mutate();
              }
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete trade"}
          </Button>
        </Panel>
      ) : null}
    </div>
  );
}
