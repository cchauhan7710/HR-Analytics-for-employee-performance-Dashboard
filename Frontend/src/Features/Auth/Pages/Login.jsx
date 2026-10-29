import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "../Hook/useAuth.js";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.registeredMessage || "");

  // Quick-fill demo credentials
  const fillDemo = () => {
    setEmail("rahulchauhaninbox@gmail.com");
    setPassword("123456789");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      await handleLogin({ email, password });
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Please check your credentials or register an account."
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-mesh-dark text-slate-100 px-4 py-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 dark:bg-slate-900 border border-white/20 p-2 shadow-xl shadow-blue-600/30 ring-2 ring-white/10 mb-4 animate-in zoom-in-90 duration-300">
            <img src="/image.png" alt="HR Pulse Logo" className="h-full w-full object-contain" />
          </div>
          <div className="mb-1">
            <h1 className="text-2xl font-black tracking-tight text-white">HR Pulse</h1>
          </div>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Enterprise Workforce & Performance Intelligence System
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-7 sm:p-8 shadow-2xl shadow-black/60 card-specular">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-400 mt-1">
              Authentication required. Enter your credentials to access system analytics
            </p>
          </div>

          {/* Success notice after registration */}
          {successMessage && (
            <div
              role="status"
              className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"
              >
                Work Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@company.com"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/70 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/70 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 py-2.5 px-4 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-700 hover:to-cyan-600 active:scale-98 transition-all cursor-pointer ring-1 ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Console"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-blue-400 hover:text-cyan-300 transition-colors ml-1"
              >
                Sign Up Now
              </Link>
            </p>
          </div>
        </div>

        {/* Demo quick-fill card */}
        <button
          type="button"
          onClick={fillDemo}
          className="mt-4 w-full text-left rounded-2xl border border-dashed border-blue-500/40 bg-blue-950/30 p-4 hover:border-blue-400/70 hover:bg-blue-950/50 transition-all cursor-pointer group"
        >
          <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Demo Account — click to auto-fill
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            📧 rahulchauhaninbox@gmail.com
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            🔑 123456789
          </p>
          <p className="text-[10px] text-slate-500 mt-1.5">
            This account has 1,000 employees + 3 years of data pre-loaded.
            Register a new account to start with your own fresh workspace.
          </p>
        </button>

        {/* Security badge footer */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Enterprise Session • JWT Auth • MySQL Live Sync</span>
        </div>
      </div>
    </main>
  );
};

export default Login;
