import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "../../api/services";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/shared/Button";
import { demoCredentials } from "../../lib/constants";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: demoCredentials[0].email, password: demoCredentials[0].password });
  const [resetForm, setResetForm] = useState({ email: "", oldPassword: "", newPassword: "" });
  const [showResetHint, setShowResetHint] = useState(false);
  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      navigate("/dashboard");
    }
  });

  const googleMutation = useMutation({
    mutationFn: (token) => authApi.googleAuth({ token }),
    onSuccess: (data) => {
      setAuth(data);
      navigate("/dashboard");
    }
  });

  const resetMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      // Keep form open to show success message, or handle however
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel w-full max-w-md p-8">
        <div className="font-mono text-xs uppercase tracking-[0.38em] text-cyber">Access Terminal</div>
        <h1 className="mt-3 text-3xl font-semibold">Citizen login</h1>
        <div className="mt-2 text-sm text-slate-400">Use seeded accounts or register a new operator.</div>
        {!showResetHint ? (
          <>
            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                mutation.mutate(form);
              }}
            >
              <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" />
              <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" />
              <Button className="w-full" type="submit">
                {mutation.isPending ? "Authenticating..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Or</div>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <div className="mt-6 flex justify-center [&>div]:!w-full [&>div>div]:!w-full [&_iframe]:!w-full [&_iframe]:!max-w-full">
              <GoogleLogin
                onSuccess={(credentialResponse) => googleMutation.mutate(credentialResponse.credential)}
                onError={() => console.error("Google Login Failed")}
                theme="outline"
                shape="pill"
              />
            </div>

            {googleMutation.error ? <div className="mt-3 text-sm text-danger">{googleMutation.error.response?.data?.message || "Google Login failed"}</div> : null}
            {mutation.error ? <div className="mt-3 text-sm text-danger">{mutation.error.response?.data?.message || "Login failed"}</div> : null}
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 text-sm text-slate-300">Directly reset your password below:</div>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                resetMutation.mutate(resetForm);
              }}
            >
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
                value={resetForm.email}
                onChange={(e) => setResetForm((c) => ({ ...c, email: e.target.value }))}
                placeholder="Email to reset"
                required
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
                type="password"
                value={resetForm.oldPassword}
                onChange={(e) => setResetForm((c) => ({ ...c, oldPassword: e.target.value }))}
                placeholder="Current Password"
                required
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
                type="password"
                value={resetForm.newPassword}
                onChange={(e) => setResetForm((c) => ({ ...c, newPassword: e.target.value }))}
                placeholder="New Password"
                required
                minLength={6}
              />
              <Button className="w-full py-2 text-sm" type="submit" disabled={resetMutation.isPending}>
                {resetMutation.isPending ? "Resetting..." : "Confirm Reset"}
              </Button>
            </form>
            {resetMutation.error ? <div className="mt-3 text-sm text-danger">{resetMutation.error.response?.data?.message || "Reset failed"}</div> : null}
            {resetMutation.isSuccess ? <div className="mt-3 text-sm text-emerald-400">Password reset successful! You can now login.</div> : null}
          </div>
        )}
        <button
          type="button"
          className="mt-4 text-sm text-cyber"
          onClick={() => {
            setShowResetHint((current) => !current);
            resetMutation.reset();
          }}
        >
          {showResetHint ? "Back to login" : "Forgot password?"}
        </button>
        <div className="mt-6 space-y-2 text-xs text-slate-500">
          {demoCredentials.map((cred) => (
            <div key={cred.email}>{cred.role}: {cred.email} / {cred.password}</div>
          ))}
        </div>
        <Link to="/register" className="mt-6 block text-sm text-cyber">
          Register new identity
        </Link>
      </div>
    </div>
  );
}
