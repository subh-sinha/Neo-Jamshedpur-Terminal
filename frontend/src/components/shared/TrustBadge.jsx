import { StatusBadge } from "./StatusBadge";

export function TrustBadge({ value }) {
  return <StatusBadge value={value || "Trusted"} />;
}
