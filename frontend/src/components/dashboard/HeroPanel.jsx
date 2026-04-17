import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Panel } from "../shared/Panel";
import { StatusBadge } from "../shared/StatusBadge";

export function HeroPanel({ user, criticalAlert }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <Panel className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber/8 via-transparent to-danger/10" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.36em] text-cyber/80">Citizen Terminal</div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
              Welcome back, {user?.fullName || "Operator"}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Monitor job flows, resource exchanges, trusted connections, and city pulse in one integrated command surface.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <StatusBadge value={user?.trustRank || "New"} />
              <StatusBadge value={user?.verificationStatus || "none"} />
              <StatusBadge value={user?.role || "citizen"} />
            </div>
          </div>
          <div className="w-full max-w-md rounded-3xl border border-danger/30 bg-danger/10 p-4 shadow-danger">
            <div className="flex items-center gap-2 text-danger">
              <AlertTriangle size={18} />
              <span className="font-mono text-xs uppercase tracking-[0.28em]">Live Alert Banner</span>
            </div>
            <div className="mt-3 text-lg font-semibold">{criticalAlert?.title || "No critical alerts right now"}</div>
            <div className="mt-2 text-sm text-slate-300">{criticalAlert?.summary || "System monitoring all sectors."}</div>
          </div>
        </div>
      </Panel>
    </motion.div>
  );
}
