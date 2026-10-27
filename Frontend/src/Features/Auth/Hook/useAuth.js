import { useContext } from "react";
import { AuthContext } from "../Auth.context.jsx";
import { login, register, logout } from "../Services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, token, setToken, loading, setLoading, logoutUser, isAuthenticated } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (data && data.accessToken) {
        localStorage.setItem("hr_token", data.accessToken);
        localStorage.setItem("token", data.accessToken);
        setToken(data.accessToken);
      }
      if (data && data.user) {
        localStorage.setItem("hr_user", JSON.stringify(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ name, email, role, password }) => {
    setLoading(true);
    try {
      const data = await register({ name, email, role, password });
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.warn("Logout request error:", error?.message);
    } finally {
      logoutUser();
      setLoading(false);
    }
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && (token || localStorage.getItem("token") || localStorage.getItem("hr_token"))),
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
