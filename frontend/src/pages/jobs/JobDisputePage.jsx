import { Panel } from "../../components/shared/Panel";

export function JobDisputePage() {
  return (
    <Panel>
      <div className="text-xl font-semibold">Job dispute console</div>
      <div className="mt-4 text-sm text-slate-300">
        This route is reserved for dispute filing and admin review workflows tied to job lifecycle locks.
      </div>
    </Panel>
  );
}
