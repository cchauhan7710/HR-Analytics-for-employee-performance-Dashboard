import { useContext } from "react";
import { AuthContext } from "../Auth.context.jsx";
import { login, register, logout } from "../Services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ name, email, role, password }) => {
    setLoading(true);
    try {
      await register({ name, email, role, password });
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    setLoading(true);
    try {
       await logout();
      setUser(null);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleLogout, handleLogin, handleRegister };
};
