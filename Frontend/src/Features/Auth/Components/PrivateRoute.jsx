import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Hook/useAuth";

/**
 * PrivateRoute – redirects unauthenticated users to /login.
 * Saves the attempted URL so the user is returned after login.
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
