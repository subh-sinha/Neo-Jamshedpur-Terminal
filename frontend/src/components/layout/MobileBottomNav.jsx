import { Home, BriefcaseBusiness, Repeat2, Radio, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/jobs", icon: BriefcaseBusiness, label: "Jobs" },
  { to: "/trades", icon: Repeat2, label: "Trades" },
  { to: "/pulse", icon: Radio, label: "Pulse" },
  { to: "/profile", icon: User, label: "Profile" }
];

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-700 bg-panel/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `flex flex-col items-center gap-1 px-2 py-3 text-xs ${isActive ? "text-cyber" : "text-slate-400"}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
