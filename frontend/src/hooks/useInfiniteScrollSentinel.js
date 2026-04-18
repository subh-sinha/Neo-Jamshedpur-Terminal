import { useEffect, useRef } from "react";

export function useInfiniteScrollSentinel({ enabled, onIntersect, rootMargin = "300px" }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [enabled, onIntersect, rootMargin]);

  return sentinelRef;
}
