import { SkeletonCard } from "./SkeletonCard";

export function InfiniteScrollLoader({ count = 2 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => <SkeletonCard key={index} />)}
    </div>
  );
}
