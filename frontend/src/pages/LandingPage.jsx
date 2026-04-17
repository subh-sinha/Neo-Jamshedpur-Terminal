import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/shared/Button";

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-grid bg-[size:32px_32px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(54,241,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,82,99,0.12),transparent_24%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
          <div className="font-mono text-xs uppercase tracking-[0.45em] text-cyber">Neo-Jamshedpur Citizen Terminal</div>
          <h1 className="mt-6 text-5xl font-semibold leading-tight md:text-7xl">
            The civic operating system for work, trade, trust, and city pulse.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            A unified citizen hub with role-based identity, live alerts, reputation, negotiation workflows, and a premium cyberpunk dashboard built for believable city operations.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/login">
              <Button className="px-6 py-3">Enter Terminal</Button>
            </Link>
            <Link to="/register">
              <Button variant="ghost" className="px-6 py-3">
                Create Identity
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
