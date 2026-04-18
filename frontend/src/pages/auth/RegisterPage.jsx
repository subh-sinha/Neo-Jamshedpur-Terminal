import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "../../api/services";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/shared/Button";

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    sector: ""
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
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

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel w-full max-w-md p-8">
        <div className="font-mono text-xs uppercase tracking-[0.38em] text-cyber">Identity Fabrication</div>
        <h1 className="mt-3 text-3xl font-semibold">Register a citizen profile</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate(form);
          }}
        >
          {["fullName", "username", "email", "password", "sector"].map((field) => (
            <input
              key={field}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              type={field === "password" ? "password" : "text"}
              value={form[field]}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              placeholder={field}
            />
          ))}
          {mutation.error ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {mutation.error.response?.data?.message || "Registration failed. Make sure the backend is running and reachable."}
            </div>
          ) : null}
          <Button className="w-full" type="submit">
            {mutation.isPending ? "Creating..." : "Create profile"}
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10"></div>
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Or</div>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => googleMutation.mutate(credentialResponse.credential)}
            onError={() => console.error("Google Signup Failed")}
            theme="filled_black"
            shape="pill"
            text="signup_with"
          />
        </div>

        {googleMutation.error ? <div className="mt-3 text-sm text-danger">{googleMutation.error.response?.data?.message || "Google Registration failed"}</div> : null}

        <Link to="/login" className="mt-6 block text-sm text-cyber">
          Return to login
        </Link>
      </div>
    </div>
  );
}
