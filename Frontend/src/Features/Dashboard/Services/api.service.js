import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if stored in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Organization Overview & Reports
export const fetchOverviewReport = async (department = "All", period = "All") => {
  const res = await api.get("/reports/overview", {
    params: { department, period },
  });
  return res.data;
};

// Employees
export const fetchEmployees = async (search = "", department = "All", status = "All") => {
  const res = await api.get("/employees", {
    params: { search, department, status },
  });
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

// Performance Reviews
export const fetchEmployeePerformanceReviews = async (employeeId) => {
  const res = await api.get(`/employees/${employeeId}/performance-reviews`);
  return res.data;
};

export const createPerformanceReview = async (reviewData) => {
  const res = await api.post("/performance-reviews", reviewData);
  return res.data;
};

// Attendance Monthly
export const fetchEmployeeAttendance = async (employeeId) => {
  const res = await api.get(`/employees/${employeeId}/attendance`);
  return res.data;
};

export const createAttendanceRecord = async (attendanceData) => {
  const res = await api.post("/attendance", attendanceData);
  return res.data;
};

// Tasks
export const fetchEmployeeTasks = async (employeeId) => {
  const res = await api.get(`/employees/${employeeId}/tasks`);
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res.data;
};

export const updateTask = async (taskId, taskData) => {
  const res = await api.patch(`/tasks/${taskId}`, taskData);
  return res.data;
};

// Individual Employee Report
export const fetchEmployeeReport = async (employeeId) => {
  const res = await api.get(`/reports/employee/${employeeId}`);
  return res.data;
};

export default api;
