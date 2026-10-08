import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  Target,
  Clock,
  CheckSquare,
  Printer,
  TrendingUp,
  PlusCircle,
  Star,
  Building2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";
import {
  fetchEmployeeById,
  fetchEmployeePerformanceReviews,
  fetchEmployeeAttendance,
  fetchEmployeeTasks,
  updateTask,
  fetchEmployees,
} from "../Services/api.service";

export default function IndividualProfileView({
  isDark = true,
  selectedEmployeeId = "EMP001",
  onSelectEmployee,
  onOpenDataEntry,
  onOpenReport,
}) {
  const [employeeId, setEmployeeId] = useState(selectedEmployeeId);
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMetric, setSelectedMetric] = useState("rating");
  const [activeTab, setActiveTab] = useState("reviews");

  useEffect(() => {
    fetchEmployees()
      .then((res) => setAllEmployees(res.employees || []))
      .catch((e) => console.error("Could not fetch employee list:", e));
  }, []);

  useEffect(() => {
    if (selectedEmployeeId && selectedEmployeeId !== employeeId) {
      setEmployeeId(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const loadEmployeeData = async (id = employeeId) => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, reviewsRes, attendanceRes, tasksRes] = await Promise.all([
        fetchEmployeeById(id),
        fetchEmployeePerformanceReviews(id),
        fetchEmployeeAttendance(id),
        fetchEmployeeTasks(id),
      ]);

      setProfileData(profileRes);
      setReviews(reviewsRes.reviews || []);
      setAttendance(attendanceRes.attendance || []);
      setTasks(tasksRes.tasks || []);
    } catch (err) {
      console.error("IndividualProfile load error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load employee profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      loadEmployeeData(employeeId);
    }
  }, [employeeId]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      await updateTask(taskId, {
        status: newStatus,
        completed_date: newStatus === "Completed" ? today : null,
      });
      const tasksRes = await fetchEmployeeTasks(employeeId);
      setTasks(tasksRes.tasks || []);
    } catch (err) {
      alert("Failed to update task status: " + err.message);
    }
  };

  const gridColor = isDark ? "#1e293b" : "#e2e8f0";
  const axisColor = isDark ? "#94a3b8" : "#475569";

  if (loading && !profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] rounded-3xl border p-8 bg-white/80 border-slate-200/90 dark:bg-slate-900/60 dark:border-slate-800 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20 shadow-xs mb-3">
          <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">Loading {employeeId} Profile...</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fetching appraisal ratings and operational history</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border p-8 text-center shadow-xs border-rose-200 bg-rose-50/80 dark:bg-rose-950/40 dark:border-rose-900/60">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400 mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-base font-bold text-rose-800 dark:text-rose-300">Error Loading Profile</p>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>
        <button
          onClick={() => loadEmployeeData(employeeId)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Profile</span>
        </button>
      </div>
    );
  }

  const { employee = {}, stats = {} } = profileData || {};

  const reviewsChartData = reviews.map((r) => ({
    period: r.review_period,
    date: r.review_date,
    rating: parseFloat(r.rating_out_of_5),
    goals: parseFloat(r.goals_completed_percent),
    summary: r.review_summary,
  }));

  const attendanceChartData = attendance.map((a) => ({
    month: a.month,
    attendanceRate: parseFloat(a.attendance_rate_percent),
    absenteeismRate: parseFloat(a.absenteeism_rate_percent),
    presentDays: a.present_days,
    workingDays: a.working_days,
  }));

  const tasksChartData = tasks.map((t) => ({
    name: t.task_id.replace(/^TSK-/, ""),
    taskId: t.task_id,
    durationDays: t.completion_duration_days || 0,
    status: t.status,
    priority: t.priority,
    isOnTime: t.is_on_time,
  }));

  return (
    <div className="space-y-6">
      {/* ── Employee Switcher & Quick Profile Header ───────── */}
      <div className="rounded-2xl p-5 sm:p-6 border backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-700 to-cyan-500 text-white font-extrabold text-xl shadow-lg shadow-blue-600/30 ring-2 ring-white/10">
              {employee.employee_id ? employee.employee_id.replace("EMP", "") : "EP"}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-extrabold tracking-tight font-metric text-slate-900 dark:text-white">
                  {employee.employee_id}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                    employee.employment_status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80"
                      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      employee.employment_status === "Active" ? "bg-emerald-400" : "bg-slate-400"
                    }`}
                  />
                  {employee.employment_status}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-bold border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80">
                  <Building2 className="w-3 h-3 text-blue-500" />
                  {employee.department}
                </span>
              </div>
              <p className="text-sm font-semibold mt-1 text-slate-700 dark:text-slate-300">{employee.job_title}</p>
              <p className="text-xs mt-0.5 flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>Date Joined:</span>
                <span className="font-metric font-medium text-slate-600 dark:text-slate-400">
                  {employee.date_joined
                    ? new Date(employee.date_joined).toISOString().split("T")[0]
                    : "—"}
                </span>
              </p>
            </div>
          </div>

          {/* Switcher & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            {/* Quick Switcher */}
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <label htmlFor="emp-select" className="text-xs font-bold uppercase tracking-wider whitespace-nowrap text-slate-500 dark:text-slate-400">
                Switch:
              </label>
              <select
                id="emp-select"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  if (onSelectEmployee) onSelectEmployee(e.target.value);
                }}
                className="w-full sm:w-auto rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer border-slate-200 bg-slate-50/80 text-slate-800 dark:bg-slate-950/80 dark:border-slate-700 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                {allEmployees.map((e) => (
                  <option key={e.employee_id} value={e.employee_id}>
                    {e.employee_id} - {e.job_title} ({e.department})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onOpenReport(employee.employee_id)}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Report Memo</span>
            </button>
            <button
              onClick={() => onOpenDataEntry("review", employee.employee_id)}
              className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-700 hover:to-cyan-700 active:scale-98 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>
            <button
              onClick={() => onOpenDataEntry("attendance", employee.employee_id)}
              className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold active:scale-98 transition-all cursor-pointer border-slate-300/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Attendance</span>
            </button>
            <button
              onClick={() => onOpenDataEntry("task", employee.employee_id)}
              className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold active:scale-98 transition-all cursor-pointer border-slate-300/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Task</span>
            </button>
          </div>
        </div>

        {/* ── Summary Stats Strip for this Employee ──────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="rounded-xl p-4 border transition-all bg-amber-50/50 border-amber-100/80 dark:bg-amber-950/30 dark:border-amber-900/60 dark:hover:border-amber-600/50">
            <div className="flex items-center justify-between text-amber-500 dark:text-amber-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Avg Rating
              </span>
              <Star className="w-4 h-4 fill-amber-400/20" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-metric text-slate-900 dark:text-white">
                {stats.avg_rating !== null ? stats.avg_rating : "—"}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ 5.0</span>
            </div>
            <span className="text-[11px] font-medium mt-1 block text-slate-500 dark:text-slate-400">
              Across {reviews.length} periods
            </span>
          </div>

          <div className="rounded-xl p-4 border transition-all bg-sky-50/50 border-sky-100/80 dark:bg-cyan-950/30 dark:border-cyan-900/60 dark:hover:border-cyan-600/50">
            <div className="flex items-center justify-between text-cyan-500 dark:text-cyan-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Avg Goals Done
              </span>
              <Target className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-metric text-slate-900 dark:text-white">
                {stats.avg_goals_completed !== null ? `${stats.avg_goals_completed}%` : "—"}
              </span>
            </div>
            <span className="text-[11px] font-medium mt-1 block text-slate-500 dark:text-slate-400">
              Key Results success
            </span>
          </div>

          <div className="rounded-xl p-4 border transition-all bg-emerald-50/50 border-emerald-100/80 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:hover:border-emerald-600/50">
            <div className="flex items-center justify-between text-emerald-500 dark:text-emerald-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Avg Attendance
              </span>
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-metric text-slate-900 dark:text-white">
                {stats.avg_attendance_rate !== null ? `${stats.avg_attendance_rate}%` : "—"}
              </span>
            </div>
            <span className="text-[11px] font-medium mt-1 block text-slate-500 dark:text-slate-400">
              Absenteeism: {stats.avg_absenteeism_rate || 0}%
            </span>
          </div>

          <div className="rounded-xl p-4 border transition-all bg-teal-50/60 border-teal-200/80 dark:bg-teal-950/30 dark:border-teal-900/60 dark:hover:border-teal-600/50">
            <div className="flex items-center justify-between text-teal-600 dark:text-teal-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                On-Time Tasks
              </span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-metric text-slate-900 dark:text-white">
                {stats.on_time_completion_rate}%
              </span>
            </div>
            <span className="text-[11px] font-medium mt-1 block font-metric text-slate-500 dark:text-slate-400">
              {stats.completed_tasks}/{stats.total_tasks} completed
            </span>
          </div>
        </div>
      </div>

      {/* ── Interactive Metric Dropdown & Trend Chart ───────── */}
      <div className="rounded-2xl p-5 sm:p-6 border backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Performance Measure Trajectory
              </h3>
            </div>
            <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">
              Chronological dated trend plotted in original metric units
            </p>
          </div>

          {/* Metric Selector Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="measure-select" className="text-xs font-bold uppercase tracking-wider whitespace-nowrap text-slate-500 dark:text-slate-400">
              Measure:
            </label>
            <select
              id="measure-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full sm:w-auto rounded-xl border px-3.5 py-2 text-xs font-bold shadow-2xs cursor-pointer border-slate-200 bg-slate-50/80 text-slate-800 dark:border-slate-700/80 dark:bg-slate-950/90 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="rating">Appraisal Rating (1.0 to 5.0 scale)</option>
              <option value="goals">Goals Completed (% of Key Results)</option>
              <option value="attendance">Monthly Attendance & Absenteeism (%)</option>
              <option value="tasks">Task Completion Turnaround (Days)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-80 w-full pt-2">
          {selectedMetric === "rating" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reviewsChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis
                  domain={[1, 5]}
                  tick={{ fontSize: 11, fill: isDark ? "#60a5fa" : "#2563eb" }}
                  label={{ value: "Rating (/5)", angle: -90, position: "insideLeft", fontSize: 10, fill: isDark ? "#60a5fa" : "#2563eb" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div
                          className={`rounded-xl border p-3.5 text-xs shadow-xl backdrop-blur-xl transition-colors ${
                            isDark
                              ? "border-slate-700 bg-slate-950/95 text-white ring-1 ring-white/10"
                              : "border-slate-200 bg-white/95 text-slate-800 shadow-slate-300/60"
                          }`}
                        >
                          <p className="font-bold text-blue-600 dark:text-cyan-400">{label} ({item.date})</p>
                          <p className="mt-1 text-sm font-black font-metric text-amber-500">Rating: {item.rating} / 5.0</p>
                          <p className={`mt-1 italic text-[11px] ${isDark ? "text-slate-300" : "text-slate-600"}`}>"{item.summary}"</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="rating"
                  name="Appraisal Rating (/ 5.0)"
                  stroke={isDark ? "#60a5fa" : "#2563eb"}
                  strokeWidth={3.5}
                  dot={{ r: 6, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {selectedMetric === "goals" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reviewsChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#06b6d4" }}
                  label={{ value: "Goals Completed (%)", angle: -90, position: "insideLeft", fontSize: 10, fill: "#06b6d4" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#030712" : "#ffffff",
                    color: isDark ? "#fff" : "#1e293b",
                    borderRadius: "12px",
                    border: isDark ? "1px solid #334155" : "1px solid #cbd5e1",
                    fontSize: "12px",
                    boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.5)" : "0 10px 25px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar
                  dataKey="goals"
                  name="Goals Completed (%)"
                  fill="#06b6d4"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {selectedMetric === "attendance" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="indAttGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#10b981" }}
                  label={{ value: "Rate (%)", angle: -90, position: "insideLeft", fontSize: 10, fill: "#10b981" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#030712" : "#ffffff",
                    color: isDark ? "#fff" : "#1e293b",
                    borderRadius: "12px",
                    border: isDark ? "1px solid #334155" : "1px solid #cbd5e1",
                    fontSize: "12px",
                    boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.5)" : "0 10px 25px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="attendanceRate"
                  name="Attendance Rate (%)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#indAttGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="absenteeismRate"
                  name="Absenteeism Rate (%)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {selectedMetric === "tasks" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: axisColor }} />
                <YAxis
                  domain={[0, "auto"]}
                  tick={{ fontSize: 11, fill: isDark ? "#38bdf8" : "#0284c7" }}
                  label={{ value: "Turnaround (Days)", angle: -90, position: "insideLeft", fontSize: 10, fill: isDark ? "#38bdf8" : "#0284c7" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div
                          className={`rounded-xl border p-3.5 text-xs shadow-xl backdrop-blur-xl transition-colors ${
                            isDark
                              ? "border-slate-700 bg-slate-950/95 text-white ring-1 ring-white/10"
                              : "border-slate-200 bg-white/95 text-slate-800 shadow-slate-300/60"
                          }`}
                        >
                          <p className="font-bold text-blue-600 dark:text-cyan-400">{item.taskId}</p>
                          <p className="mt-1">Turnaround: <strong className="font-metric text-blue-700 dark:text-cyan-300">{item.durationDays} days</strong></p>
                          <p className={isDark ? "text-slate-300" : "text-slate-600"}>Status: {item.status}</p>
                          <p className={isDark ? "text-slate-300" : "text-slate-600"}>Priority: {item.priority}</p>
                          <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            {item.isOnTime === 1 ? "✓ Delivered On-Time" : item.status === "Completed" ? "⚠ Delayed Delivery" : "⏳ Active Task"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar
                  dataKey="durationDays"
                  name="Task Completion Turnaround (Calendar Days)"
                  fill="#0284c7"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Analytical Footnote */}
        <div className="mt-4 pt-3 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] gap-1 border-slate-100 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>
            {selectedMetric === "rating" && "Appraisal rating records are evaluated on a consistent 1 to 5 scale."}
            {selectedMetric === "goals" && "Goals completed reflects targeted key results completed within the half-yearly period."}
            {selectedMetric === "attendance" && "Monthly attendance percentage = (present days / working days) * 100."}
            {selectedMetric === "tasks" && "Completion duration = completed date minus assigned date in days for closed tasks."}
          </span>
          <span className="font-semibold text-blue-600 dark:text-cyan-400">
            Source: MySQL hr_analytics
          </span>
        </div>
      </div>

      {/* ── Detail Records Section with Sub-Tabs ────────────── */}
      <div className="rounded-2xl border backdrop-blur-xl overflow-hidden bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
        {/* Sub-tab navigation */}
        <div className="flex border-b px-4 sm:px-6 pt-3 gap-2 overflow-x-auto border-slate-200/90 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-950/70">
          {[
            { id: "reviews", label: "Performance Reviews", count: reviews.length, icon: Star },
            { id: "attendance", label: "Monthly Attendance", count: attendance.length, icon: Calendar },
            { id: "tasks", label: "Tasks & Assignments", count: tasks.length, icon: CheckSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400 bg-white/80 dark:bg-slate-900/60 rounded-t-lg"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-metric ${
                  isActive
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300"
                    : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Performance Reviews */}
        {activeTab === "reviews" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider border-b bg-slate-100/80 border-slate-200 text-slate-700 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Review Period</th>
                  <th className="px-5 py-3.5">Review Date</th>
                  <th className="px-5 py-3.5">Rating (/5)</th>
                  <th className="px-5 py-3.5">Goals Done (%)</th>
                  <th className="px-5 py-3.5">Summary / Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {reviews.map((r) => (
                  <tr key={r.review_id} className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-5 py-3.5 font-bold font-metric text-slate-900 dark:text-white">{r.review_period}</td>
                    <td className="px-5 py-3.5 font-metric text-slate-600 dark:text-slate-400">{r.review_date}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg font-metric bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {parseFloat(r.rating_out_of_5).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold font-metric text-cyan-600 dark:text-cyan-400">
                      {parseFloat(r.goals_completed_percent).toFixed(0)}%
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 max-w-md">{r.review_summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Monthly Attendance */}
        {activeTab === "attendance" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider border-b bg-slate-100/80 border-slate-200 text-slate-700 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Month</th>
                  <th className="px-5 py-3.5">Working Days</th>
                  <th className="px-5 py-3.5">Present</th>
                  <th className="px-5 py-3.5">Absent</th>
                  <th className="px-5 py-3.5">Approved Leaves</th>
                  <th className="px-5 py-3.5">Attendance Rate</th>
                  <th className="px-5 py-3.5">Absenteeism</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-metric">
                {attendance.map((a) => (
                  <tr key={a.attendance_id} className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{a.month}</td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-400">{a.working_days}</td>
                    <td className="px-5 py-3.5 font-semibold text-emerald-600 dark:text-emerald-400">{a.present_days}</td>
                    <td className="px-5 py-3.5 font-semibold text-rose-600 dark:text-rose-400">{a.absent_days}</td>
                    <td className="px-5 py-3.5 font-semibold text-amber-600 dark:text-amber-400">{a.leave_days}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {parseFloat(a.attendance_rate_percent).toFixed(1)}%
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                      {parseFloat(a.absenteeism_rate_percent).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Tasks */}
        {activeTab === "tasks" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider border-b bg-slate-100/80 border-slate-200 text-slate-700 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Task ID</th>
                  <th className="px-5 py-3.5">Assigned</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5">Completed</th>
                  <th className="px-5 py-3.5">Turnaround</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-metric">
                {tasks.map((t) => (
                  <tr key={t.task_id} className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{t.task_id}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{t.assigned_date}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{t.due_date}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                      {t.completed_date || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                      {t.completion_duration_days !== null
                        ? `${t.completion_duration_days} days`
                        : "Open"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                          t.priority === "High" || t.priority === "Critical"
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80"
                            : t.priority === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80"
                            : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={t.status}
                        onChange={(e) => handleTaskStatusChange(t.task_id, e.target.value)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold border cursor-pointer ${
                          t.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80"
                            : t.status === "In Progress"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80"
                            : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Not Started">Not Started</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      {t.is_on_time === 1 && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>On-Time</span>
                        </span>
                      )}
                      {t.is_on_time === 0 && (
                        <span className="inline-flex items-center gap-1 text-rose-500 dark:text-rose-400 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Delayed</span>
                        </span>
                      )}
                      {t.is_on_time === null && (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
