import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});
export async function register({ name, email, role, password }) {
  try {
    const response = await api.post("/register", {
      name,
      email,
      role,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
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
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}
