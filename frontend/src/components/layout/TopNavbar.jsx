import { Bell, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../shared/Button";
import { notificationApi } from "../../api/services";

export function TopNavbar() {
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
    <header className="sticky top-0 z-30 border-b border-slate-700 bg-panel/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
        <Link to="/dashboard" className="min-w-fit text-lg font-semibold text-cyber">Neo-Jamshedpur</Link>
        <form
          className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/50 px-4 py-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!query.trim()) return;
            navigate(`/search?q=${encodeURIComponent(query)}`);
          }}
        >
          <Search size={18} className="text-cyber" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search jobs, trade, pulse, people..."
            className="w-full bg-transparent text-sm text-slate-50 outline-none placeholder:text-slate-400"
          />
        </form>
        <Link to="/notifications" className="relative rounded-2xl border border-slate-700 bg-panel p-3 text-slate-400">
          <Bell size={18} />
          {unreadCount > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" /> : null}
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="hidden text-sm text-slate-300 md:block">@{user.username}</Link>
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </>
        ) : null}
      </div>
    </header>
  );
}
