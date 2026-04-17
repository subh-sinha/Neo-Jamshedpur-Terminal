import { useQuery } from "@tanstack/react-query";
import { pulseApi } from "../../api/services";
import { PulseCard } from "../../components/pulse/PulseCard";
import { Panel } from "../../components/shared/Panel";

export function SavedPulsePage() {
  const { data: saved = [] } = useQuery({ queryKey: ["pulse-saved"], queryFn: pulseApi.saved });
  const { data: history = [] } = useQuery({ queryKey: ["pulse-history"], queryFn: pulseApi.history });

  return (
    <div className="space-y-6">
      <Panel>
        <div className="text-xl font-semibold">Saved Pulse updates</div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {saved.map((post) => <PulseCard key={post._id} post={post} />)}
        </div>
      </Panel>
      <Panel>
        <div className="text-xl font-semibold">Recently viewed / alert history</div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {history.map((post) => <PulseCard key={`${post._id}-${post.viewedAt}`} post={post} />)}
        </div>
      </Panel>
    </div>
  );
}
