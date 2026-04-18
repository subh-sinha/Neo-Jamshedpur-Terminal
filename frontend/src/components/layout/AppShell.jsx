import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useSession } from "../../hooks/useSession";

export function AppShell() {
  useSession();

  return (
    <div className="min-h-screen bg-grid bg-[size:28px_28px] px-4 py-6 md:px-6">
      <div className="mx-auto flex max-w-7xl gap-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
