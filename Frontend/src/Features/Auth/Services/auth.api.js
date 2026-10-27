import axios from "axios";

const rawAuthBase =
  import.meta.env.VITE_AUTH_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_SERVER_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api/auth" : "/api/auth");

const cleanBase = rawAuthBase.replace(/\/+$/, "");
const AUTH_BASE_URL = cleanBase.endsWith("/auth")
  ? cleanBase
  : cleanBase.endsWith("/api")
  ? `${cleanBase}/auth`
  : `${cleanBase}/api/auth`;

const api = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hr_token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register({ name, email, role, password }) {
  const response = await api.post("/register", {
    name,
    email,
    role,
    password,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/login", {
    email,
    password,
  });
  return response.data;
}

export async function logout() {
  try {
    const token = localStorage.getItem("hr_token") || localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.post("/logout", {}, { headers });
    return response.data;
  } catch (error) {
    console.warn("Logout request failed:", error?.message);
    return null;
  }
}
