import { cn } from "../../lib/utils";
import { Panel } from "./Panel";

export function SectionCard({ title, subtitle, action, children, className, icon: Icon, iconClassName }) {
  return (
    <Panel className={className}>
      {(title || action) ? (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-50">
                {Icon ? (
                  <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800 text-slate-400", iconClassName)}>
                    <Icon size={18} />
                  </span>
                ) : null}
                <span>{title}</span>
              </div>
            ) : null}
            {subtitle ? <div className="mt-1 text-sm text-slate-400">{subtitle}</div> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </Panel>
  );
}
