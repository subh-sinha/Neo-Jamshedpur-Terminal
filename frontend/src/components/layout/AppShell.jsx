import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pulseApi } from "../../api/services";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useSession } from "../../hooks/useSession";

export function AppShell() {
  useSession();
  const { data: pulse = [] } = useQuery({
    queryKey: ["global-critical-pulse"],
    queryFn: () => pulseApi.list({ priority: "CRITICAL", sort: "priority" }),
    refetchInterval: 15000
  });
  const critical = pulse[0];

  return (
    <div className="min-h-screen bg-grid bg-[size:28px_28px] px-4 py-6 md:px-6">
      <div className="mx-auto flex max-w-7xl gap-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          {critical ? (
            <a href={`/pulse/${critical._id}`} className="mb-4 block rounded-3xl border border-danger/40 bg-danger/12 p-4 shadow-danger">
              <div className="font-mono text-xs uppercase tracking-[0.32em] text-danger">Persistent global alert</div>
              <div className="mt-1 text-lg font-semibold text-white">{critical.title}</div>
              <div className="mt-1 text-sm text-slate-300">{critical.summary}</div>
            </a>
          ) : null}
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
