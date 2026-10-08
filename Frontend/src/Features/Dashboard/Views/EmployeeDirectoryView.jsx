import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  ArrowUpRight,
  Star,
  Calendar,
  CheckSquare,
  Building2,
  XCircle,
  Filter,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { fetchEmployees } from "../Services/api.service";

const DEPT_COLORS = {
  Finance: "from-emerald-500 to-teal-600 text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  HR: "from-pink-500 to-rose-600 text-rose-400 bg-rose-500/15 border-rose-500/30",
  IT: "from-blue-600 to-indigo-600 text-blue-400 bg-blue-500/15 border-blue-500/30",
  Marketing: "from-amber-500 to-orange-600 text-amber-400 bg-amber-500/15 border-amber-500/30",
  Operations: "from-teal-500 to-emerald-600 text-teal-400 bg-teal-500/15 border-teal-500/30",
  Sales: "from-cyan-500 to-blue-600 text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
};

export default function EmployeeDirectoryView({ isDark = true, onSelectEmployee, onOpenDataEntry }) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchEmployees(searchTerm, selectedDept, selectedStatus);
      setEmployees(res.employees || []);
      setDepartments(res.departments || []);
    } catch (err) {
      console.error("EmployeeDirectory error:", err);
      setError(err.message || "Failed to load employee directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadEmployees();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedDept, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* ── Search & Filter Controls ─────────────────────────── */}
      <div className="rounded-2xl p-5 border backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by ID (EMP001), Title, Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border pl-10 pr-9 py-2.5 text-xs text-slate-900 border-slate-200 bg-slate-50/80 dark:bg-slate-950/80 dark:border-slate-700/80 dark:text-white dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department & Status Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer border-slate-200 bg-slate-50/80 text-slate-700 dark:bg-slate-950/80 dark:border-slate-700/80 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer border-slate-200 bg-slate-50/80 text-slate-700 dark:bg-slate-950/80 dark:border-slate-700/80 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
              <option value="Terminated">Terminated</option>
            </select>

            {/* Add Employee Button */}
            <button
              onClick={() => onOpenDataEntry("employee")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-700 hover:to-cyan-700 active:scale-98 transition-all whitespace-nowrap cursor-pointer ring-1 ring-white/10"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 flex items-center justify-between text-xs border-t pt-3 border-slate-100 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Showing <strong className="text-slate-900 dark:text-white font-metric">{employees.length}</strong> matching enterprise records
          </span>
          {(searchTerm || selectedDept !== "All" || selectedStatus !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDept("All");
                setSelectedStatus("All");
              }}
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Employees Grid / Table ───────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[360px] rounded-2xl border p-8 bg-white/70 border-slate-200/80 dark:bg-slate-900/60 dark:border-slate-800">
          <RefreshCw className="h-7 w-7 text-indigo-500 animate-spin mb-2" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Querying employee database...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border p-6 text-center text-xs border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300">
          {error}
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center border-slate-200 bg-white dark:bg-slate-900/70 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No employees found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search query or department scope filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border shadow-xs backdrop-blur-xl bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider border-b bg-slate-50/80 border-slate-200 text-slate-500 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Job Title</th>
                  <th className="px-5 py-3.5">Date Joined</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {employees.map((emp) => {
                  const deptStyle = DEPT_COLORS[emp.department] || "from-slate-500 to-slate-700 text-slate-400 bg-slate-500/15 border-slate-500/30";
                  return (
                    <tr
                      key={emp.employee_id}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors group cursor-pointer"
                      onClick={() => onSelectEmployee(emp.employee_id)}
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr ${deptStyle} text-white font-bold text-xs shadow-2xs`}>
                            {emp.employee_id.replace("EMP", "")}
                          </div>
                          <div>
                            <span className="font-metric font-bold text-blue-600 dark:text-cyan-400">
                              {emp.employee_id}
                            </span>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                              Staff Member
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                        {emp.job_title}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-metric">
                        {emp.date_joined ? new Date(emp.date_joined).toISOString().split("T")[0] : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            emp.employment_status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80"
                              : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              emp.employment_status === "Active" ? "bg-emerald-400" : "bg-slate-400"
                            }`}
                          />
                          {emp.employment_status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectEmployee(emp.employee_id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:from-blue-700 hover:to-cyan-700 active:scale-98 transition-all cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onOpenDataEntry("review", emp.employee_id)}
                            title="Add Appraisal Review"
                            className="rounded-lg border p-1.5 transition-colors cursor-pointer border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-amber-950/40 dark:hover:text-amber-400"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenDataEntry("attendance", emp.employee_id)}
                            title="Log Attendance"
                            className="rounded-lg border p-1.5 transition-colors cursor-pointer border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenDataEntry("task", emp.employee_id)}
                            title="Assign Task"
                            className="rounded-lg border p-1.5 transition-colors cursor-pointer border-slate-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-400"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
