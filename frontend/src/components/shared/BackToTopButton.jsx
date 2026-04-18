import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-4 z-30 rounded-full border border-slate-700 bg-panel px-4 py-2 text-sm font-medium text-slate-300 shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-800/50 lg:bottom-6"
    >
      Back to top
    </button>
  );
}
