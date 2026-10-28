import React, { createContext, useState, useEffect, useCallback } from "react";
import { login, register, logout as apiLogout } from "./Services/auth.api.js";

export const AuthContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  logoutUser: () => {},
  handleLogout: () => {},
  handleLogin: async () => {},
  handleRegister: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("hr_user") || localStorage.getItem("user");
      const storedToken = localStorage.getItem("hr_token") || localStorage.getItem("token");
      if (storedUser && storedToken) return JSON.parse(storedUser);
    } catch {
      /* ignore */
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("hr_token") || localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (["hr_user", "user", "hr_token", "token"].includes(e.key)) {
        const storedUser = localStorage.getItem("hr_user") || localStorage.getItem("user");
        const storedToken = localStorage.getItem("hr_token") || localStorage.getItem("token");
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ── Core auth helpers ──────────────────────────────────────────────────────
  const _persist = (userData, accessToken) => {
    localStorage.setItem("hr_token", accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("hr_user", JSON.stringify(userData));
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const _clear = () => {
    localStorage.removeItem("hr_token");
    localStorage.removeItem("token");
    localStorage.removeItem("hr_user");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const handleLogin = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (data?.accessToken && data?.user) {
        _persist(data.user, data.accessToken);
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async ({ name, email, role, password }) => {
    setLoading(true);
    try {
      const data = await register({ name, email, role, password });
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await apiLogout();
    } catch {
      /* ignore API errors on logout */
    } finally {
      _clear();
      setLoading(false);
      // Hard redirect so all state resets cleanly
      window.location.href = "/login";
    }
  }, []);

  // Legacy alias kept for backward compat
  const logoutUser = _clear;

  const isAuthenticated = Boolean(user && (token || localStorage.getItem("hr_token")));

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
        setLoading,
        logoutUser,
        handleLogin,
        handleRegister,
        handleLogout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
