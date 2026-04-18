import { useEffect, useMemo, useRef, useState } from "react";

export function useInfiniteVisible(items = [], step = 6) {
  const [visibleCount, setVisibleCount] = useState(step);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(step);
  }, [items, step]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + step, items.length || current + step));
        }
      },
      { rootMargin: "180px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [items.length, step]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hasMore = visibleCount < items.length;

  return {
    visibleItems,
    visibleCount,
    totalCount: items.length,
    hasMore,
    sentinelRef
  };
}
