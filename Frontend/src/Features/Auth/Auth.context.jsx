import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  logoutUser: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("hr_user") || localStorage.getItem("user");
      const storedToken = localStorage.getItem("hr_token") || localStorage.getItem("token");
      if (storedUser && storedToken) {
        return JSON.parse(storedUser);
      }
    } catch (err) {
      console.warn("Failed to parse stored user data:", err);
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("hr_token") || localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync authentication state across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "hr_user" || e.key === "user" || e.key === "hr_token" || e.key === "token") {
        try {
          const storedUser = localStorage.getItem("hr_user") || localStorage.getItem("user");
          const storedToken = localStorage.getItem("hr_token") || localStorage.getItem("token");
          if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          } else {
            setUser(null);
            setToken(null);
          }
        } catch {
          setUser(null);
          setToken(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("hr_token");
    localStorage.removeItem("token");
    localStorage.removeItem("hr_user");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(user && (token || localStorage.getItem("token") || localStorage.getItem("hr_token")));

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
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
