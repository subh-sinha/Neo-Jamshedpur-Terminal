import { Panel } from "../../components/shared/Panel";

export function PlaceholderAdminPage({ title, description }) {
  return (
    <Panel>
      <div className="text-xl font-semibold">{title}</div>
      <div className="mt-4 text-sm text-slate-300">{description}</div>
    </Panel>
  );
}
