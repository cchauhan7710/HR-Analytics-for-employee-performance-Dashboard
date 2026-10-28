import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Mail, Shield, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../Hook/useAuth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select an authorized system role.");
      return;
    }

    try {
      await handleRegister({ name, email, role, password });
      navigate("/login", {
        state: {
          registeredMessage: "Account created successfully! Please sign in with your credentials.",
          email,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. The corporate email may already be in use."
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-mesh-dark text-slate-100 px-4 py-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/20 to-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 dark:bg-slate-900 border border-white/20 p-2 shadow-xl shadow-blue-600/30 ring-2 ring-white/10 mb-3.5 animate-in zoom-in-90 duration-300">
            <img src="/image.png" alt="HR Pulse Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl font-black tracking-tight text-white">HR Pulse</h1>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              PRO
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Provision New Corporate Administrator Account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-7 sm:p-8 shadow-2xl shadow-black/60 card-specular">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white tracking-tight">Create System Account</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your corporate personnel details for credentials provisioning
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Sarah Jenkins"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/70 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
              >
                Corporate Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="s.jenkins@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/70 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
              >
                Assigned Role Scope
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Shield className="w-4 h-4" />
                </span>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/70 text-xs text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="admin" className="bg-slate-900 text-white">Administrator (Full Access)</option>
                  <option value="hr_manager" className="bg-slate-900 text-white">HR Manager (Appraisals & Operations)</option>
                  <option value="viewer" className="bg-slate-900 text-white">Viewer (Audit Read-Only)</option>
                </select>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 pl-1">
                {role === "admin" && "Full access — manage employees, reviews, tasks & all data."}
                {role === "hr_manager" && "Can add & edit performance reviews, attendance & tasks."}
                {role === "viewer" && "Read-only — can view dashboards but cannot modify data."}
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
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
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
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
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 py-2.5 px-4 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-700 hover:to-cyan-600 active:scale-98 transition-all cursor-pointer ring-1 ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
            >
              <span>{loading ? "Provisioning..." : "Complete Registration"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-400 hover:text-cyan-300 transition-colors ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Enterprise Session • MySQL Live Sync</span>
        </div>
      </div>
    </main>
  );
};

export default Register;
