import { Panel } from "../shared/Panel";

const sectors = [
  { name: "Dock-9", level: "High alert", x: "18%", y: "58%" },
  { name: "Arc-Light", level: "Trade hotspot", x: "52%", y: "28%" },
  { name: "East Canal", level: "Community surge", x: "70%", y: "66%" }
];

export function SectorMap() {
  return (
    <Panel className="overflow-hidden">
      <div className="mb-4 font-semibold">Sector Activity Grid</div>
      <div className="relative h-72 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_center,rgba(54,241,255,0.12),transparent_45%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:auto,30px_30px,30px_30px]">
        {sectors.map((sector) => (
          <div key={sector.name} className="absolute" style={{ left: sector.x, top: sector.y }}>
            <div className="h-3 w-3 rounded-full bg-cyber shadow-[0_0_18px_rgba(54,241,255,0.9)]" />
            <div className="mt-2 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs">
              <div className="font-semibold text-white">{sector.name}</div>
              <div className="text-slate-400">{sector.level}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
