import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/services";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/shared/Button";
import { demoCredentials } from "../../lib/constants";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: demoCredentials[0].email, password: demoCredentials[0].password });
  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      navigate("/dashboard");
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel w-full max-w-md p-8">
        <div className="font-mono text-xs uppercase tracking-[0.38em] text-cyber">Access Terminal</div>
        <h1 className="mt-3 text-3xl font-semibold">Citizen login</h1>
        <div className="mt-2 text-sm text-slate-400">Use seeded accounts or register a new operator.</div>
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
        {mutation.error ? <div className="mt-3 text-sm text-danger">{mutation.error.response?.data?.message || "Login failed"}</div> : null}
        <button
          type="button"
          className="mt-4 text-sm text-cyber"
          onClick={() => window.alert("Forgot password flow is not wired to email yet. Use an admin reset or implement a reset endpoint next.")}
        >
          Forgot password?
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
