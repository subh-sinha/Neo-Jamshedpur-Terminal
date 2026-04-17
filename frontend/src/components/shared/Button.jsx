import { cn } from "../../lib/utils";

export function Button({ className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-cyber/90 text-slate-950 hover:bg-cyber",
    ghost: "border border-white/10 bg-white/5 hover:bg-white/10",
    danger: "bg-danger/90 hover:bg-danger"
  };

  return (
    <button
      className={cn("rounded-2xl px-4 py-2 text-sm font-semibold transition", variants[variant], className)}
      {...props}
    />
  );
}
