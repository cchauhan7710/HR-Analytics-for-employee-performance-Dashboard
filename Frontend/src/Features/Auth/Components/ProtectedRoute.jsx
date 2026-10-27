import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Hook/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-blue-500/20 border-t-cyan-400 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
