import { Bell, BriefcaseBusiness, Gauge, Radio, Search, Shield, Repeat2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navItems } from "../../lib/constants";
import { useAuthStore } from "../../store/authStore";

const navIcons = {
  "/dashboard": Gauge,
  "/jobs": BriefcaseBusiness,
  "/trades": Repeat2,
  "/pulse": Radio,
  "/search": Search,
  "/notifications": Bell,
  "/admin": Shield
};

export function Sidebar() {
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="panel sticky top-6 hidden h-[calc(100vh-3rem)] w-72 flex-col justify-between p-5 lg:flex">
      <div>
        <div className="mb-8">
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-cyber">Citizen OS</div>
          <div className="mt-2 text-2xl font-semibold">Neo-Jamshedpur Terminal</div>
          <div className="mt-2 text-sm text-slate-400">Jobs, trade, city pulse, trust, and alerts unified into one civic stack.</div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm transition ${
                  isActive ? "bg-cyber/15 text-cyber shadow-glow" : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => {
                const Icon = navIcons[item.to];
                return (
                  <span className="flex items-center gap-3">
                    {Icon ? (
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${isActive ? "bg-slate-800 text-cyber" : "bg-slate-800/70 text-slate-400"}`}>
                        <Icon size={16} />
                      </span>
                    ) : null}
                    <span>{item.label}</span>
                  </span>
                );
              }}
            </NavLink>
          ))}
          {user?.role === "admin" ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm transition ${
                  isActive ? "bg-danger/15 text-danger shadow-danger" : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <span className="flex items-center gap-3">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${isActive ? "bg-slate-800 text-danger" : "bg-slate-800/70 text-slate-400"}`}>
                    <Shield size={16} />
                  </span>
                  <span>Admin</span>
                </span>
              )}
            </NavLink>
          ) : null}
        </nav>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-sm font-semibold">{user?.fullName || "Guest Operator"}</div>
        <div className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-500">{user?.role || "public access"}</div>
      </div>
    </aside>
  );
}
