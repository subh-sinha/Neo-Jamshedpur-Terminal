import { cn } from "../../lib/utils";

export function FilterTabs({ items, value, onChange }) {
  return (
    <div className="sticky top-[74px] z-10 flex gap-2 overflow-x-auto rounded-2xl border border-slate-700 bg-panel/95 p-2 backdrop-blur">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition",
            value === item.value ? "bg-cyber text-white" : "text-slate-400 hover:bg-slate-800"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
