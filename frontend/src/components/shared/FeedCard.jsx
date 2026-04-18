import { Panel } from "./Panel";

export function FeedCard({ children, className }) {
  return <Panel className={className}>{children}</Panel>;
}
