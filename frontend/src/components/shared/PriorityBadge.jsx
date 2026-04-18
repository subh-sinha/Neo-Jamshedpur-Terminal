import { StatusBadge } from "./StatusBadge";

export function PriorityBadge({ value }) {
  return <StatusBadge value={value || "NORMAL"} />;
}
