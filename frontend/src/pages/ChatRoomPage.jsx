import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { chatApi } from "../api/services";
import { Panel } from "../components/shared/Panel";
import { Button } from "../components/shared/Button";
import { formatDate } from "../lib/utils";
import { useAuthStore } from "../store/authStore";

export function ChatRoomPage() {
  const { roomId } = useParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState("");

  const roomQuery = useQuery({
    queryKey: ["chat-rooms"],
    queryFn: chatApi.listRooms
  });
  const messagesQuery = useQuery({
    queryKey: ["chat-room", roomId],
    queryFn: () => chatApi.getMessages(roomId),
    refetchInterval: 5000
  });

  const sendMessageMutation = useMutation({
    mutationFn: (payload) => chatApi.sendMessage(roomId, payload),
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["chat-room", roomId] });
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
    }
  });

  const room = useMemo(
    () => roomQuery.data?.find((item) => item._id === roomId),
    [roomId, roomQuery.data]
  );
  const otherParticipant = room?.participants?.find((participant) => participant._id !== user?._id);

  if (messagesQuery.isLoading) {
    return (
      <Panel>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded-full bg-white/10" />
          <div className="h-20 rounded-3xl bg-white/5" />
          <div className="h-20 rounded-3xl bg-white/5" />
        </div>
      </Panel>
    );
  }

  if (messagesQuery.isError) {
    return (
      <Panel>
        <div className="text-xl font-semibold">Chat unavailable</div>
        <div className="mt-2 text-sm text-slate-400">We could not load this conversation right now.</div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_0.7fr]">
      <Panel>
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="text-xl font-semibold">{otherParticipant?.fullName || room?.contextTitle || "Direct chat"}</div>
            <div className="mt-1 text-sm text-slate-400">
              {room?.contextTitle ? `Context: ${room.contextTitle}` : "Private conversation"}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {(messagesQuery.data || []).map((item) => {
            const isMine = item.sender?._id === user?._id;
            return (
              <div key={item._id} className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-3xl border px-4 py-3 ${isMine ? "border-cyber/30 bg-cyber/10 text-white" : "border-white/10 bg-black/20 text-slate-200"}`}>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {isMine ? "You" : item.sender?.fullName || "Participant"}
                  </div>
                  <div className="whitespace-pre-line break-words text-sm">{item.content}</div>
                  <div className="mt-2 text-right text-xs text-slate-500">{formatDate(item.createdAt)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <textarea
            className="min-h-28 w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyber/30"
            placeholder="Write a message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          {sendMessageMutation.error ? (
            <div className="mt-3 text-sm text-danger">
              {sendMessageMutation.error.response?.data?.message || "Message failed to send."}
            </div>
          ) : null}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => sendMessageMutation.mutate({ content: message })}
              disabled={sendMessageMutation.isPending || !message.trim()}
            >
              {sendMessageMutation.isPending ? "Sending..." : "Send message"}
            </Button>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="text-lg font-semibold">Conversation info</div>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div>
            <span className="text-slate-500">Participant:</span> {otherParticipant?.fullName || "Unknown"}
          </div>
          <div>
            <span className="text-slate-500">Username:</span> {otherParticipant?.username ? `@${otherParticipant.username}` : "N/A"}
          </div>
          <div>
            <span className="text-slate-500">Last update:</span> {room?.lastMessageAt ? formatDate(room.lastMessageAt) : "N/A"}
          </div>
        </div>
      </Panel>
    </div>
  );
}
