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
  LayoutGrid,
  List,
  UserCheck,
  Briefcase,
  ChevronRight,
  Printer,
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

export default function EmployeeDirectoryView({
  isDark = true,
  onSelectEmployee,
  onOpenDataEntry,
  onOpenReport,
}) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

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
      <div className="rounded-2xl p-5 border transition-all card-specular shadow-sm">
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
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department, Status Filters & View Toggle */}
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

            {/* View Mode Toggle (Table / Grid) */}
            <div className="flex items-center rounded-xl border p-1 bg-slate-100 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode("table")}
                title="Table View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                title="Card Grid View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Add Employee Button */}
            <button
              onClick={() => onOpenDataEntry("employee")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:from-blue-700 hover:to-cyan-700 active:scale-95 transition-all whitespace-nowrap cursor-pointer ring-1 ring-white/20"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-100" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 flex items-center justify-between text-xs border-t pt-3 border-slate-100 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Showing <strong className="text-slate-900 dark:text-white font-metric font-bold">{employees.length}</strong> matching enterprise records
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
        <div className="flex flex-col items-center justify-center min-h-[360px] rounded-2xl border p-8 card-specular card-specular-light dark:card-specular">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-3 animate-spin">
            <RefreshCw className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">Querying Employee Database...</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Fetching records and appraisals from MySQL</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border p-6 text-center text-xs border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300">
          {error}
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center card-specular card-specular-light dark:card-specular">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No employees found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search query or department scope filter.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ── Modern Card Grid View ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees.map((emp) => {
            const deptStyle = DEPT_COLORS[emp.department] || "from-slate-500 to-slate-700 text-slate-400 bg-slate-500/15 border-slate-500/30";
            return (
              <div
                key={emp.employee_id}
                onClick={() => onSelectEmployee(emp.employee_id)}
                className="group relative rounded-2xl p-5 border transition-all cursor-pointer card-specular hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${deptStyle} text-white font-extrabold text-sm shadow-md ring-1 ring-white/20 transition-transform group-hover:scale-105`}>
                      {emp.employee_id.replace("EMP", "")}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-blue-500 transition-colors">
                        {emp.employee_id}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
                        {emp.job_title}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold border shrink-0 ${
                      emp.employment_status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80"
                        : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        emp.employment_status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                      }`}
                    />
                    {emp.employment_status}
                  </span>
                </div>

                <div className="space-y-1.5 py-3 border-y border-slate-100/90 dark:border-slate-800/80 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      Department
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{emp.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined
                    </span>
                    <span className="font-metric font-semibold text-slate-600 dark:text-slate-300">
                      {emp.date_joined ? new Date(emp.date_joined).toISOString().split("T")[0] : "—"}
                    </span>
                  </div>
                </div>

                {/* Card Quick Action Bar */}
                <div className="mt-3.5 flex items-center justify-between pt-1 gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectEmployee(emp.employee_id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-1.5 px-3 text-[11px] font-bold text-white shadow-xs hover:from-blue-700 hover:to-cyan-700 active:scale-95 transition-all cursor-pointer ring-1 ring-white/10"
                  >
                    <span>View Dossier</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => (onOpenReport ? onOpenReport(emp.employee_id, true) : onSelectEmployee(emp.employee_id))}
                      title="Print Employee Dossier"
                      className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenDataEntry("review", emp.employee_id)}
                      title="Add Review"
                      className="p-1.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-amber-950/40 dark:hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenDataEntry("task", emp.employee_id)}
                      title="Assign Task"
                      className="p-1.5 rounded-lg border border-slate-200 hover:border-cyan-400 bg-white hover:bg-cyan-50 text-slate-600 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Modern Table View ── */
        <div className="overflow-hidden rounded-2xl border transition-all card-specular shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider border-b bg-slate-50/80 border-slate-200 text-slate-500 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Employee ID & Status</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Job Role</th>
                  <th className="px-5 py-3.5">Date Joined</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {employees.map((emp) => {
                  const deptStyle = DEPT_COLORS[emp.department] || "from-slate-500 to-slate-700 text-slate-400 bg-slate-500/15 border-slate-500/30";
                  return (
                    <tr
                      key={emp.employee_id}
                      className="hover:bg-blue-500/5 dark:hover:bg-blue-500/10 transition-colors group cursor-pointer"
                      onClick={() => onSelectEmployee(emp.employee_id)}
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr ${deptStyle} text-white font-extrabold text-xs shadow-2xs`}>
                            {emp.employee_id.replace("EMP", "")}
                          </div>
                          <div>
                            <span className="font-metric font-bold text-blue-600 dark:text-cyan-400 group-hover:underline">
                              {emp.employee_id}
                            </span>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                              Staff Personnel
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
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
                              emp.employment_status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
                            }`}
                          />
                          {emp.employment_status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectEmployee(emp.employee_id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:from-blue-700 hover:to-cyan-700 active:scale-95 transition-all cursor-pointer ring-1 ring-white/10"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => (onOpenReport ? onOpenReport(emp.employee_id, true) : onSelectEmployee(emp.employee_id))}
                            title="Print Employee Dossier"
                            className="rounded-lg border p-1.5 transition-colors cursor-pointer border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
                          >
                            <Printer className="w-3.5 h-3.5" />
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
