import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Hook/useAuth";

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
}
