import { useEffect } from "react";

export function useFeedScrollRestore(key) {
  useEffect(() => {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      requestAnimationFrame(() => window.scrollTo(0, Number(stored)));
    }
    const onScroll = () => sessionStorage.setItem(key, String(window.scrollY));
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [key]);
}
