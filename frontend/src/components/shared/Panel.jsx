import { cn } from "../../lib/utils";

export function Panel({ className, children }) {
  return <div className={cn("panel p-5", className)}>{children}</div>;
}
