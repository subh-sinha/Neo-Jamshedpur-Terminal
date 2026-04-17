import { Bell, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../shared/Button";
import { notificationApi } from "../../api/services";

export function Topbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationApi.list,
    enabled: Boolean(user),
    refetchInterval: 10000
  });
  const unreadCount = notifications.filter((item) => !item.readAt).length;

  return (
    <div className="panel mb-6 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <form
        className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(`/search?q=${encodeURIComponent(query)}`);
        }}
      >
        <Search size={18} className="text-cyber" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search jobs, trades, pulse, users, sectors..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
      </form>
      <div className="flex items-center gap-3">
        <Link to="/notifications" className="relative rounded-2xl border border-white/10 bg-black/20 p-3 text-slate-300">
          <Bell size={18} />
          {unreadCount > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" /> : null}
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="text-sm text-slate-300">
              {user.username}
            </Link>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login" className="text-sm text-slate-300">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
