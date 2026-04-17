import { Panel } from "../components/shared/Panel";

export function SettingsPage() {
  return (
    <Panel>
      <div className="text-xl font-semibold">Settings</div>
      <div className="mt-4 space-y-4 text-sm text-slate-300">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">Notification routing, session persistence, live update preferences, and alert visibility would be controlled here.</div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">A theme toggle and saved filter presets are scaffold-ready stretch slots.</div>
      </div>
    </Panel>
  );
}
