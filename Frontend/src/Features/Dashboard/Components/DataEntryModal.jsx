import React, { useState } from "react";
import {
  X,
  PlusCircle,
  Star,
  Calendar,
  CheckSquare,
  UserPlus,
  Save,
  Database,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import {
  createEmployee,
  createPerformanceReview,
  createAttendanceRecord,
  createTask,
} from "../Services/api.service";

export default function DataEntryModal({
  isOpen,
  onClose,
  initialMode = "review", // "employee" | "review" | "attendance" | "task"
  prefilledEmployeeId = "",
  departments = ["Finance", "HR", "IT", "Marketing", "Operations", "Sales"],
  onSuccess,
  isDark = true,
}) {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form states
  const [empId, setEmpId] = useState(prefilledEmployeeId || "");
  const [empDept, setEmpDept] = useState(departments[0] || "IT");
  const [empTitle, setEmpTitle] = useState("");
  const [empJoined, setEmpJoined] = useState(new Date().toISOString().split("T")[0]);
  const [empStatus, setEmpStatus] = useState("Active");

  const [revEmpId, setRevEmpId] = useState(prefilledEmployeeId || "");
  const [revDate, setRevDate] = useState(new Date().toISOString().split("T")[0]);
  const [revPeriod, setRevPeriod] = useState("2026-H1");
  const [revRating, setRevRating] = useState("3.5");
  const [revGoals, setRevGoals] = useState("75");
  const [revSummary, setRevSummary] = useState("");

  const [attEmpId, setAttEmpId] = useState(prefilledEmployeeId || "");
  const [attMonth, setAttMonth] = useState("2026-01");
  const [attWorking, setAttWorking] = useState("22");
  const [attPresent, setAttPresent] = useState("20");
  const [attAbsent, setAttAbsent] = useState("1");
  const [attLeave, setAttLeave] = useState("1");

  const [taskEmpId, setTaskEmpId] = useState(prefilledEmployeeId || "");
  const [taskId, setTaskId] = useState("");
  const [taskAssigned, setTaskAssigned] = useState(new Date().toISOString().split("T")[0]);
  const [taskDue, setTaskDue] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
  );
  const [taskCompleted, setTaskCompleted] = useState("");
  const [taskStatus, setTaskStatus] = useState("In Progress");
  const [taskPriority, setTaskPriority] = useState("Medium");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === "employee") {
        if (!empId.trim()) throw new Error("Employee ID is required (e.g. EMP301).");
        if (!empTitle.trim()) throw new Error("Job title is required.");

        const res = await createEmployee({
          employee_id: empId.trim().toUpperCase(),
          department: empDept,
          job_title: empTitle.trim(),
          date_joined: empJoined,
          employment_status: empStatus,
        });
        setSuccessMsg(res.message || "Employee created successfully!");
      } else if (mode === "review") {
        if (!revEmpId.trim()) throw new Error("Employee ID is required.");
        if (!revPeriod.trim()) throw new Error("Review period is required.");
        const rating = parseFloat(revRating);
        if (isNaN(rating) || rating < 1.0 || rating > 5.0) {
          throw new Error("Rating must be between 1.0 and 5.0.");
        }
        const goals = parseFloat(revGoals);
        if (isNaN(goals) || goals < 0 || goals > 100) {
          throw new Error("Goals completed must be between 0% and 100%.");
        }

        const res = await createPerformanceReview({
          employee_id: revEmpId.trim().toUpperCase(),
          review_date: revDate,
          review_period: revPeriod.trim(),
          rating_out_of_5: rating,
          goals_completed_percent: goals,
          review_summary: revSummary.trim(),
        });
        setSuccessMsg(res.message || "Performance review saved successfully!");
      } else if (mode === "attendance") {
        if (!attEmpId.trim()) throw new Error("Employee ID is required.");
        if (!attMonth.trim() || !/^\d{4}-\d{2}$/.test(attMonth.trim())) {
          throw new Error("Month must follow YYYY-MM format (e.g. 2026-01).");
        }

        const working = parseInt(attWorking);
        const present = parseInt(attPresent);
        const absent = parseInt(attAbsent);
        const leave = parseInt(attLeave);

        if (isNaN(working) || working <= 0) throw new Error("Working days must be > 0.");
        if (isNaN(present) || present < 0) throw new Error("Present days must be >= 0.");
        if (isNaN(absent) || absent < 0) throw new Error("Absent days must be >= 0.");
        if (isNaN(leave) || leave < 0) throw new Error("Leave days must be >= 0.");

        const res = await createAttendanceRecord({
          employee_id: attEmpId.trim().toUpperCase(),
          month: attMonth.trim(),
          working_days: working,
          present_days: present,
          absent_days: absent,
          leave_days: leave,
        });
        setSuccessMsg(res.message || "Monthly attendance recorded successfully!");
      } else if (mode === "task") {
        if (!taskEmpId.trim()) throw new Error("Employee ID is required.");
        if (!taskAssigned) throw new Error("Assigned date is required.");
        if (!taskDue) throw new Error("Due date is required.");

        const res = await createTask({
          task_id: taskId.trim() || undefined,
          employee_id: taskEmpId.trim().toUpperCase(),
          assigned_date: taskAssigned,
          due_date: taskDue,
          completed_date: taskCompleted ? taskCompleted : null,
          status: taskStatus,
          priority: taskPriority,
        });
        setSuccessMsg(res.message || "Task assigned successfully!");
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "review", label: "Appraisal Review", icon: Star },
    { id: "attendance", label: "Attendance Log", icon: Calendar },
    { id: "task", label: "Task Assignment", icon: CheckSquare },
    { id: "employee", label: "New Employee", icon: UserPlus },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-200 bg-white border-slate-200/90 dark:bg-slate-900 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4.5 bg-slate-50/80 border-slate-100 dark:bg-slate-950/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-md shadow-blue-500/25">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                {mode === "employee" && "Add New Employee Profile"}
                {mode === "review" && "Record Performance Review"}
                {mode === "attendance" && "Log Monthly Attendance"}
                {mode === "task" && "Assign New Operational Task"}
              </h3>
              <p className="text-xs font-medium flex items-center gap-1.5 mt-0.5 text-slate-500 dark:text-slate-400">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Direct Persistent Save to MySQL Database</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border transition-colors cursor-pointer border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b px-4 sm:px-6 pt-3 gap-2 overflow-x-auto text-xs font-bold border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setMode(tab.id);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex items-center gap-2 pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4">
          {/* Alerts */}
          {error && (
            <div className="mb-4 rounded-xl border p-3 text-xs flex items-center gap-2 border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>
                <strong>Error:</strong> {error}
              </span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 rounded-xl border p-3 text-xs flex items-center gap-2 border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Success!</strong> {successMsg}
              </span>
            </div>
          )}

          <form id="data-entry-form" onSubmit={handleSubmit} className="space-y-4">
            {/* ================= MODE: REVIEW ================= */}
            {mode === "review" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EMP001"
                      value={revEmpId}
                      onChange={(e) => setRevEmpId(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Review Period *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2026-H1 or 2026-Q1"
                      value={revPeriod}
                      onChange={(e) => setRevPeriod(e.target.value)}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Review Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={revDate}
                      onChange={(e) => setRevDate(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Rating (1.0 - 5.0) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      required
                      value={revRating}
                      onChange={(e) => setRevRating(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Goals Done (%) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      required
                      value={revGoals}
                      onChange={(e) => setRevGoals(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Appraisal Summary / Feedback
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Key accomplishments, core strengths, and recommended development areas..."
                    value={revSummary}
                    onChange={(e) => setRevSummary(e.target.value)}
                    className="w-full rounded-xl border px-3.5 py-2 text-xs border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* ================= MODE: ATTENDANCE ================= */}
            {mode === "attendance" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EMP001"
                      value={attEmpId}
                      onChange={(e) => setAttEmpId(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Month (YYYY-MM) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2026-01"
                      value={attMonth}
                      onChange={(e) => setAttMonth(e.target.value)}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Working Days
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={attWorking}
                      onChange={(e) => setAttWorking(e.target.value)}
                      className="w-full rounded-xl border px-2.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Present Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={attPresent}
                      onChange={(e) => setAttPresent(e.target.value)}
                      className="w-full rounded-xl border px-2.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Absent Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={attAbsent}
                      onChange={(e) => setAttAbsent(e.target.value)}
                      className="w-full rounded-xl border px-2.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Leave Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={attLeave}
                      onChange={(e) => setAttLeave(e.target.value)}
                      className="w-full rounded-xl border px-2.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl p-3 text-xs flex flex-col sm:flex-row justify-between gap-1 border font-metric bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-400">
                  <span>
                    Projected Attendance Rate:{" "}
                    <strong className="text-emerald-500">
                      {attWorking > 0
                        ? ((attPresent / attWorking) * 100).toFixed(1)
                        : 0}
                      %
                    </strong>
                  </span>
                  <span>
                    Projected Absenteeism Rate:{" "}
                    <strong className="text-rose-500">
                      {attWorking > 0
                        ? ((attAbsent / attWorking) * 100).toFixed(1)
                        : 0}
                      %
                    </strong>
                  </span>
                </div>
              </>
            )}

            {/* ================= MODE: TASK ================= */}
            {mode === "task" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EMP001"
                      value={taskEmpId}
                      onChange={(e) => setTaskEmpId(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Task ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TSK-001-11"
                      value={taskId}
                      onChange={(e) => setTaskId(e.target.value)}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Assigned Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={taskAssigned}
                      onChange={(e) => setTaskAssigned(e.target.value)}
                      className="w-full rounded-xl border px-2.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={taskDue}
                      onChange={(e) => setTaskDue(e.target.value)}
                      className="w-full rounded-xl border px-2.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Completed Date
                    </label>
                    <input
                      type="date"
                      value={taskCompleted}
                      onChange={(e) => setTaskCompleted(e.target.value)}
                      className="w-full rounded-xl border px-2.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Not Started">Not Started</option>
                      <option value="Pending Review">Pending Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Priority
                    </label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* ================= MODE: EMPLOYEE ================= */}
            {mode === "employee" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EMP301"
                      value={empId}
                      onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border px-3.5 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Department *
                    </label>
                    <select
                      value={empDept}
                      onChange={(e) => setEmpDept(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Data Analyst / HR Partner"
                    value={empTitle}
                    onChange={(e) => setEmpTitle(e.target.value)}
                    className="w-full rounded-xl border px-3.5 py-2 text-xs border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Date Joined *
                    </label>
                    <input
                      type="date"
                      required
                      value={empJoined}
                      onChange={(e) => setEmpJoined(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-xs font-metric font-semibold border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      Employment Status
                    </label>
                    <select
                      value={empStatus}
                      onChange={(e) => setEmpStatus(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer border-slate-200 bg-slate-50/60 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Probation">Probation</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50/70 border-slate-100 dark:bg-slate-950/80 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-xs font-bold transition-colors cursor-pointer border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="data-entry-form"
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer ring-1 ring-white/10"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving to MySQL...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Record</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
