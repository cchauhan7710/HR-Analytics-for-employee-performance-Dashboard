import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Star,
  Target,
  CalendarCheck,
  Clock,
  Users2,
  PlusCircle,
  CalendarPlus,
  CheckSquare,
  Building2,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Layers,
} from "lucide-react";
import MetricCard from "../Components/MetricCard";
import MetricDefinitions from "../Components/MetricDefinitions";
import { fetchOverviewReport } from "../Services/api.service";

const NEON_COLORS = ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#0284c7", "#0d9488"];
const STATUS_COLORS = {
  Completed: "#10b981",
  "In Progress": "#2563eb",
  "Not Started": "#64748b",
  "Pending Review": "#f59e0b",
};

// Premium Custom Tooltip Component for Recharts
const CustomChartTooltip = ({ active, payload, label, unit = "", isDark = true }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-xl border p-3.5 shadow-xl backdrop-blur-xl text-xs transition-colors ${
          isDark
            ? "border-slate-700/90 bg-slate-950/95 text-white ring-1 ring-white/10 shadow-black/50"
            : "border-slate-200 bg-white/95 text-slate-800 shadow-slate-300/60"
        }`}
      >
        <div
          className={`font-bold mb-2 border-b pb-1.5 flex items-center justify-between gap-6 ${
            isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-700"
          }`}
        >
          <span>{label}</span>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider ${
              isDark ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            Metrics
          </span>
        </div>
        <div className="space-y-1.5 font-metric">
          {payload.map((entry, idx) => (
            <div key={`tip-${idx}`} className="flex items-center justify-between gap-5">
              <span className={`flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                <span
                  className="h-2.5 w-2.5 rounded-full shadow-xs"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {entry.value} {unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function OverviewView({ isDark = true, onOpenDataEntry, onSelectEmployee }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDept, setSelectedDept] = useState("All");

  const loadData = async (dept = selectedDept) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchOverviewReport(dept);
      setData(res);
    } catch (err) {
      console.error("Overview load error:", err);
      setError(err.message || "Failed to load overview analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedDept);
  }, [selectedDept]);

  const gridColor = isDark ? "#1e293b" : "#e2e8f0";
  const axisColor = isDark ? "#94a3b8" : "#475569";

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] rounded-3xl p-8 border bg-white/80 border-slate-200/90 dark:bg-slate-900/60 dark:border-slate-800/90 shadow-xl">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20 shadow-xs mb-4">
          <RefreshCw className="h-7 w-7 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Loading Enterprise Analytics</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm text-center">
          Querying dual-level performance ratings, attendance logs, and task telemetry from MySQL...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border p-8 text-center shadow-xs border-rose-200/90 bg-rose-50/70 dark:bg-rose-950/40 dark:border-rose-900/60">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400 mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-base font-bold text-rose-800 dark:text-rose-300">Connection Error</p>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => loadData(selectedDept)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const {
    kpis = {},
    reviewTrends = [],
    attendanceTrends = [],
    deptBreakdown = [],
    taskStatusDistribution = [],
    taskPriorityDistribution = [],
    departments = [],
  } = data || {};

  return (
    <div className="space-y-6">
      {/* ── Filter Bar & Quick Operations ──────────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-2xl p-4 sm:p-5 border backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>Scope:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedDept("All")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                selectedDept === "All"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-white/10"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-700/80"
              }`}
            >
              All Departments
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedDept === dept
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-white/10"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-700/80"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => onOpenDataEntry("review")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-700 hover:to-cyan-700 active:scale-98 transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-100" />
            <span>Add Review</span>
          </button>
          <button
            onClick={() => onOpenDataEntry("attendance")}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold active:scale-98 transition-all shrink-0 cursor-pointer border-slate-300/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-slate-400" />
            <span>Log Attendance</span>
          </button>
          <button
            onClick={() => onOpenDataEntry("task")}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold active:scale-98 transition-all shrink-0 cursor-pointer border-slate-300/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Assign Task</span>
          </button>
        </div>
      </div>

      {/* ── KPI Strip (5 Core Metric Cards) ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Avg Review Rating"
          value={kpis.avg_review_rating ? `${kpis.avg_review_rating}` : "—"}
          unit="/ 5.0"
          subtitle={`${kpis.total_reviews || 0} reviews evaluated`}
          badge={kpis.avg_review_rating >= 3.5 ? "Strong Grade" : "Baseline"}
          badgeType="amber"
          icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500/20" />}
        />

        <MetricCard
          title="Goals Completed"
          value={kpis.avg_goals_completed ? `${kpis.avg_goals_completed}` : "—"}
          unit="%"
          subtitle="Key Results progress"
          badge={kpis.avg_goals_completed >= 70 ? "On Target" : "Review"}
          badgeType="sky"
          icon={<Target className="w-5 h-5 text-cyan-500" />}
        />

        <MetricCard
          title="Avg Attendance Rate"
          value={kpis.avg_attendance_rate ? `${kpis.avg_attendance_rate}` : "—"}
          unit="%"
          subtitle={`Absenteeism: ${kpis.avg_absenteeism_rate || 0}%`}
          badge="12M Mean"
          badgeType="emerald"
          icon={<CalendarCheck className="w-5 h-5 text-emerald-500" />}
        />

        <MetricCard
          title="On-Time Delivery"
          value={kpis.on_time_completion_rate ? `${kpis.on_time_completion_rate}` : "—"}
          unit="%"
          subtitle={`Avg Speed: ${kpis.avg_completion_days || 0} days`}
          badge={`${kpis.completed_tasks || 0} done`}
          badgeType="teal"
          icon={<Clock className="w-5 h-5 text-teal-500" />}
        />

        <MetricCard
          title="Workforce Size"
          value={kpis.total_employees}
          unit="Headcount"
          subtitle={`${kpis.active_employees} Active Status`}
          badge={selectedDept === "All" ? "Company-wide" : selectedDept}
          badgeType="blue"
          icon={<Users2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        />
      </div>

      {/* ── Metric Definitions Component ─────────────────────── */}
      <MetricDefinitions isDark={isDark} />

      {/* ── Charts Grid (2x2 Multi-Perspective Visualizations) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Chart 1: Appraisal Review Trends */}
        <div className="rounded-2xl p-5 sm:p-6 border backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  Multi-Period Performance Appraisal Trend
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Half-yearly review history (2023-H1 to 2025-H2)
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80">
              6 Review Periods
            </span>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={reviewTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="review_period" tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis
                  yAxisId="left"
                  domain={[1, 5]}
                  tick={{ fontSize: 11, fill: isDark ? "#60a5fa" : "#2563eb" }}
                  label={{ value: "Rating (/5)", angle: -90, position: "insideLeft", fontSize: 10, fill: isDark ? "#60a5fa" : "#2563eb" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#06b6d4" }}
                  label={{ value: "Goals (%)", angle: 90, position: "insideRight", fontSize: 10, fill: "#06b6d4" }}
                />
                <Tooltip content={<CustomChartTooltip isDark={isDark} />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar
                  yAxisId="right"
                  dataKey="avg_goals_completed"
                  name="Avg Goals Completed (%)"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                  opacity={0.85}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avg_rating"
                  name="Avg Rating (out of 5)"
                  stroke={isDark ? "#60a5fa" : "#2563eb"}
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Attendance Trend */}
        <div className="rounded-2xl p-5 sm:p-6 border backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  Monthly Attendance & Absenteeism Pattern
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calendar Year 2025 monthly tracking (Original % Units)
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80">
              12 Months
            </span>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="absGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: axisColor }} />
                <Tooltip content={<CustomChartTooltip isDark={isDark} unit="%" />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="avg_attendance_rate"
                  name="Attendance Rate (%)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#attGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="avg_absenteeism_rate"
                  name="Absenteeism Rate (%)"
                  stroke="#ef4444"
                  strokeWidth={1.8}
                  fill="url(#absGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department Comparison */}
        <div className="rounded-2xl p-5 sm:p-6 border backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  Department Performance Benchmarks
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cross-department average rating vs. on-time delivery
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
              {deptBreakdown.length} Departments
            </span>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis
                  yAxisId="rating"
                  domain={[0, 5]}
                  tick={{ fontSize: 11, fill: isDark ? "#60a5fa" : "#2563eb" }}
                  label={{ value: "Rating (/5)", angle: -90, position: "insideLeft", fontSize: 10, fill: isDark ? "#60a5fa" : "#2563eb" }}
                />
                <YAxis
                  yAxisId="onTime"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#10b981" }}
                  label={{ value: "On-Time %", angle: 90, position: "insideRight", fontSize: 10, fill: "#10b981" }}
                />
                <Tooltip content={<CustomChartTooltip isDark={isDark} />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar
                  yAxisId="rating"
                  dataKey="avg_rating"
                  name="Avg Rating (/5)"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="onTime"
                  dataKey="on_time_rate"
                  name="On-Time Delivery %"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Task Execution & Status Breakdown */}
        <div className="rounded-2xl p-5 sm:p-6 border backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  Operational Task Execution Breakdown
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Distribution of assigned tasks across workflow statuses
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/80">
              3,000 Tasks Total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-72 sm:h-80 items-center">
            {/* Donut chart for status */}
            <div className="h-64 w-full">
              <p className="text-center text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">
                By Workflow Status
              </p>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={taskStatusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {taskStatusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || NEON_COLORS[index % NEON_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip isDark={isDark} />} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart for priorities */}
            <div className="h-64 w-full">
              <p className="text-center text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">
                By Task Priority Level
              </p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={taskPriorityDistribution}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: axisColor }} />
                  <YAxis
                    type="category"
                    dataKey="priority"
                    tick={{ fontSize: 11, fill: axisColor }}
                  />
                  <Tooltip content={<CustomChartTooltip isDark={isDark} />} />
                  <Bar dataKey="count" name="Tasks" fill="#0284c7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── Department Benchmarks Data Table ──────────────────── */}
      <div className="rounded-2xl p-5 sm:p-6 border backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Department Performance Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Aggregated Across All Active Employees
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-slate-100/80 border-slate-200 text-slate-700 dark:bg-slate-950/60 dark:border-slate-800 dark:text-slate-400">
                <th className="py-3 px-4 font-bold">Department</th>
                <th className="py-3 px-4 font-bold text-right">Headcount</th>
                <th className="py-3 px-4 font-bold text-right">Avg Rating</th>
                <th className="py-3 px-4 font-bold text-right">Goals Done</th>
                <th className="py-3 px-4 font-bold text-right">Attendance</th>
                <th className="py-3 px-4 font-bold text-right">Total Tasks</th>
                <th className="py-3 px-4 font-bold text-right">On-Time %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {deptBreakdown.map((row) => (
                <tr
                  key={row.department}
                  className="hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedDept(row.department)}
                >
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600 group-hover:scale-125 transition-transform" />
                    <span>{row.department}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-metric text-slate-700 dark:text-slate-300 font-semibold">
                    {row.employee_count}
                  </td>
                  <td className="py-3 px-4 text-right font-metric font-bold text-blue-600 dark:text-cyan-400">
                    {row.avg_rating} / 5.0
                  </td>
                  <td className="py-3 px-4 text-right font-metric text-slate-700 dark:text-slate-300 font-semibold">
                    {row.avg_goals_completed}%
                  </td>
                  <td className="py-3 px-4 text-right font-metric text-emerald-600 dark:text-emerald-400 font-bold">
                    {row.avg_attendance_rate}%
                  </td>
                  <td className="py-3 px-4 text-right font-metric text-slate-600 dark:text-slate-400">
                    {row.total_tasks}
                  </td>
                  <td className="py-3 px-4 text-right font-metric font-bold text-slate-900 dark:text-slate-200">
                    {row.on_time_rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
