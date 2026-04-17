import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { AppShell } from "../components/layout/AppShell";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SettingsPage } from "../pages/SettingsPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { SearchPage } from "../pages/SearchPage";
import { JobsPage } from "../pages/jobs/JobsPage";
import { JobDetailsPage } from "../pages/jobs/JobDetailsPage";
import { JobFormPage } from "../pages/jobs/JobFormPage";
import { MyJobsPage } from "../pages/jobs/MyJobsPage";
import { MyApplicationsPage } from "../pages/jobs/MyApplicationsPage";
import { JobDisputePage } from "../pages/jobs/JobDisputePage";
import { TradesPage } from "../pages/trades/TradesPage";
import { TradeDetailsPage } from "../pages/trades/TradeDetailsPage";
import { TradeFormPage } from "../pages/trades/TradeFormPage";
import { MyTradesPage } from "../pages/trades/MyTradesPage";
import { OffersPage } from "../pages/trades/OffersPage";
import { TradeHistoryPage } from "../pages/trades/TradeHistoryPage";
import { PulseFeedPage } from "../pages/pulse/PulseFeedPage";
import { PulseDetailsPage } from "../pages/pulse/PulseDetailsPage";
import { PulseCreatePage } from "../pages/pulse/PulseCreatePage";
import { SavedPulsePage } from "../pages/pulse/SavedPulsePage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { ManageUsersPage } from "../pages/admin/ManageUsersPage";
import { PlaceholderAdminPage } from "../pages/admin/PlaceholderAdminPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "jobs", element: <JobsPage /> },
      { path: "jobs/create", element: <JobFormPage /> },
      { path: "jobs/mine", element: <MyJobsPage /> },
      { path: "jobs/applications", element: <MyApplicationsPage /> },
      { path: "jobs/dispute", element: <JobDisputePage /> },
      { path: "jobs/:id", element: <JobDetailsPage /> },
      { path: "trades", element: <TradesPage /> },
      { path: "trades/create", element: <TradeFormPage /> },
      { path: "trades/mine", element: <MyTradesPage /> },
      { path: "trades/:id/offers/:offerId", element: <OffersPage /> },
      { path: "trades/history", element: <TradeHistoryPage /> },
      { path: "trades/:id", element: <TradeDetailsPage /> },
      { path: "pulse", element: <PulseFeedPage /> },
      { path: "pulse/create", element: <PulseCreatePage /> },
      { path: "pulse/saved", element: <SavedPulsePage /> },
      { path: "pulse/:id", element: <PulseDetailsPage /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <ManageUsersPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/verify-providers",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <PlaceholderAdminPage title="Verify providers" description="Provider verification actions are supported in the backend and represented here as a dedicated moderation surface." />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/moderation",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <PlaceholderAdminPage title="Moderation queue" description="Jobs, trades, and pulse content can be reviewed and resolved here." />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/disputes",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <PlaceholderAdminPage title="Resolve disputes" description="Dispute resolution, penalties, and audit outcomes flow through this panel." />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/alerts",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <PlaceholderAdminPage title="Broadcast alerts" description="Admin alert broadcasting is available through the backend API and surfaced here as a future control panel." />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/analytics",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        )
      }
    ]
  }
]);
