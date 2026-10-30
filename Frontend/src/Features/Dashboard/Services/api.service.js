import axios from "axios";

const rawApiUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_SERVER_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

const API_BASE_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Attach JWT token from localStorage on every request ─────────────────────
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("hr_token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auto-redirect to /login on 401 responses ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hr_token");
      localStorage.removeItem("token");
      localStorage.removeItem("hr_user");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Organization Overview & Reports ──────────────────────────────────────────
export const fetchOverviewReport = async (department = "All", period = "All") => {
  const res = await api.get("/reports/overview", { params: { department, period } });
  return res.data;
};

// ── Employees ─────────────────────────────────────────────────────────────────
export const fetchEmployees = async (search = "", department = "All", status = "All") => {
  const res = await api.get("/employees", { params: { search, department, status } });
  return res.data;
};

export const fetchEmployeeById = async (employeeId) => {
  const res = await api.get(`/employees/${employeeId}`);
  return res.data;
};

export const createEmployee = async (employeeData) => {
  const res = await api.post("/employees", employeeData);
  return res.data;
};

export const updateEmployee = async (employeeId, employeeData) => {
  const res = await api.patch(`/employees/${employeeId}`, employeeData);
  return res.data;
};

// ── Performance Reviews ───────────────────────────────────────────────────────
export const fetchEmployeePerformanceReviews = async (employeeId) => {
  const res = await api.get(`/employees/${employeeId}/performance-reviews`);
  return res.data;
};

export const createPerformanceReview = async (reviewData) => {
  const res = await api.post("/performance-reviews", reviewData);
  return res.data;
};

// ── Attendance Monthly ────────────────────────────────────────────────────────
export const fetchEmployeeAttendance = async (employeeId) => {
  const res = await api.get(`/employees/${employeeId}/attendance`);
  return res.data;
};

export const createAttendanceRecord = async (attendanceData) => {
  const res = await api.post("/attendance", attendanceData);
  return res.data;
};

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const fetchEmployeeTasks = async (employeeId) => {
  const res = await api.get(`/employees/${employeeId}/tasks`);
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res.data;
};

export const importEmployeesFromExcel = async (formData) => {
  const res = await api.post("/legacy-employees/importEmployeesFromExcel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateTask = async (taskId, taskData) => {
  const res = await api.patch(`/tasks/${taskId}`, taskData);
  return res.data;
};

// ── Individual Employee Report ─────────────────────────────────────────────────
export const fetchEmployeeReport = async (employeeId) => {
  const res = await api.get(`/reports/employee/${employeeId}`);
  return res.data;
};

export default api;
