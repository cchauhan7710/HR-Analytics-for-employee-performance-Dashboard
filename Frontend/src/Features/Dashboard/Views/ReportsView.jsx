import React, { useState, useEffect } from "react";
import {
  FileText,
  Printer,
  Building2,
  User,
  Star,
  Target,
  CalendarCheck,
  Clock,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  fetchOverviewReport,
  fetchEmployeeReport,
  fetchEmployees,
} from "../Services/api.service";

export default function ReportsView({ isDark = true, initialEmployeeId = "EMP001" }) {
  const [reportType, setReportType] = useState("individual"); // "individual" | "overview"
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(initialEmployeeId);
  const [employeesList, setEmployeesList] = useState([]);

  // Data states
  const [overviewData, setOverviewData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees()
      .then((res) => setEmployeesList(res.employees || []))
      .catch((err) => console.error("Error fetching employees for report:", err));
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);
      if (reportType === "overview") {
        const res = await fetchOverviewReport("All");
        setOverviewData(res);
      } else {
        const res = await fetchEmployeeReport(selectedEmployeeId);
        setEmployeeData(res);
      }
    } catch (err) {
      console.error("Report loading error:", err);
      setError(err.message || "Failed to load report data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [reportType, selectedEmployeeId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ── Report Controls (Hidden in Print) ───────────────── */}
      <div className="print:hidden rounded-2xl p-4 sm:p-5 border backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 bg-white/95 border-slate-200/80 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Scope:</span>
          </span>

          <div className="flex rounded-xl p-1 border bg-slate-100/90 border-slate-200/60 dark:bg-slate-950/80 dark:border-slate-800">
            <button
              onClick={() => setReportType("individual")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                reportType === "individual"
                  ? "bg-white text-blue-700 shadow-xs dark:bg-blue-600 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Individual Dossier</span>
            </button>
            <button
              onClick={() => setReportType("overview")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                reportType === "overview"
                  ? "bg-white text-blue-700 shadow-xs dark:bg-blue-600 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Org Overview</span>
            </button>
          </div>

          {reportType === "individual" && (
            <div className="flex items-center gap-2">
              <label htmlFor="emp-report-select" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target:
              </label>
              <select
                id="emp-report-select"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 focus:outline-none"
              >
                {employeesList.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_id} - {emp.job_title} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-700 hover:to-cyan-700 active:scale-98 transition-all cursor-pointer ring-1 ring-white/10"
        >
          <Printer className="w-4 h-4 text-blue-100" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* ── Report Document Body (Printable Paper Style) ─────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border p-8 bg-white/70 border-slate-200/80 dark:bg-slate-900/60 dark:border-slate-800">
          <RefreshCw className="h-7 w-7 text-blue-600 animate-spin mb-2" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Compiling executive report dossier...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border p-6 text-center text-xs border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300">
          {error}
        </div>
      ) : (
        <div className="rounded-3xl border shadow-xl p-6 sm:p-10 max-w-4xl mx-auto bg-white border-slate-200/90 dark:bg-slate-900/90 dark:border-slate-800 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
          {/* Document Header */}
          <div className="border-b-2 pb-5 mb-6 flex flex-col sm:flex-row items-start justify-between gap-4 border-slate-900 dark:border-slate-700 print:border-slate-900">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 text-blue-600 dark:text-cyan-400 print:text-blue-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise Workforce Performance Audit</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white print:text-slate-900">
                {reportType === "individual"
                  ? `Performance Dossier: ${employeeData?.employee?.employee_id}`
                  : "Organization-Wide Workforce & Operational Memo"}
              </h1>
              <p className="text-xs mt-1 text-slate-500 dark:text-slate-400 print:text-slate-500">
                Generated from Live MySQL Database • As of {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-bold text-white font-metric bg-slate-900 dark:bg-slate-800 print:bg-slate-900">
                HR-REPORT-{new Date().getFullYear()}
              </span>
              <p className="text-[10px] mt-1 uppercase font-semibold text-slate-400 dark:text-slate-500 print:text-slate-400">Strictly Confidential</p>
            </div>
          </div>

          {/* ================= REPORT TYPE: INDIVIDUAL ================= */}
          {reportType === "individual" && employeeData && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl text-xs border bg-slate-50 border-slate-200/80 dark:bg-slate-950/60 dark:border-slate-800 print:bg-slate-50 print:border-slate-200">
                <div>
                  <span className="uppercase text-[10px] font-bold text-slate-400 dark:text-slate-500">Employee ID</span>
                  <p className="font-bold font-metric text-sm mt-0.5 text-slate-900 dark:text-white print:text-slate-900">{employeeData.employee.employee_id}</p>
                </div>
                <div>
                  <span className="uppercase text-[10px] font-bold text-slate-400 dark:text-slate-500">Department</span>
                  <p className="font-bold text-sm mt-0.5 text-slate-900 dark:text-white print:text-slate-900">{employeeData.employee.department}</p>
                </div>
                <div>
                  <span className="uppercase text-[10px] font-bold text-slate-400 dark:text-slate-500">Job Title</span>
                  <p className="font-bold text-sm mt-0.5 text-slate-900 dark:text-white print:text-slate-900">{employeeData.employee.job_title}</p>
                </div>
                <div>
                  <span className="uppercase text-[10px] font-bold text-slate-400 dark:text-slate-500">Status</span>
                  <p className="font-bold text-sm mt-0.5 text-emerald-600 dark:text-emerald-400 print:text-emerald-700">{employeeData.employee.employment_status}</p>
                </div>
              </div>

              {/* Performance Scorecards */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">
                  Summary Scorecards
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl border bg-white border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 print:bg-white print:border-slate-200">
                    <span className="text-[10px] font-bold uppercase flex items-center justify-between text-slate-400 dark:text-slate-500">
                      <span>Avg Rating</span>
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                    </span>
                    <p className="text-2xl font-black font-metric mt-1 text-blue-600 dark:text-cyan-400 print:text-blue-700">
                      {employeeData.summary.avgRating} <span className="text-xs font-medium text-slate-400">/ 5.0</span>
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{employeeData.summary.totalReviews} appraisals</span>
                  </div>

                  <div className="p-4 rounded-xl border bg-white border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 print:bg-white print:border-slate-200">
                    <span className="text-[10px] font-bold uppercase flex items-center justify-between text-slate-400 dark:text-slate-500">
                      <span>Goals Done</span>
                      <Target className="w-3.5 h-3.5 text-cyan-500" />
                    </span>
                    <p className="text-2xl font-black font-metric mt-1 text-cyan-600 dark:text-cyan-400 print:text-cyan-700">
                      {employeeData.summary.avgGoals}%
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Average completion</span>
                  </div>

                  <div className="p-4 rounded-xl border bg-white border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 print:bg-white print:border-slate-200">
                    <span className="text-[10px] font-bold uppercase flex items-center justify-between text-slate-400 dark:text-slate-500">
                      <span>Attendance</span>
                      <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                    <p className="text-2xl font-black font-metric mt-1 text-emerald-600 dark:text-emerald-400 print:text-emerald-700">
                      {employeeData.summary.avgAttendance}%
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">12 months mean</span>
                  </div>

                  <div className="p-4 rounded-xl border bg-white border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 print:bg-white print:border-slate-200">
                    <span className="text-[10px] font-bold uppercase flex items-center justify-between text-slate-400 dark:text-slate-500">
                      <span>On-Time Tasks</span>
                      <Clock className="w-3.5 h-3.5 text-teal-500" />
                    </span>
                    <p className="text-2xl font-black font-metric mt-1 text-teal-600 dark:text-teal-400 print:text-teal-700">
                      {employeeData.summary.onTimeRate}%
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Turnaround: {employeeData.summary.avgTaskDays} days</span>
                  </div>
                </div>
              </div>

              {/* Performance Review Timeline Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500 dark:text-slate-400">
                  Performance Appraisal Timeline
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400 print:bg-slate-100 print:text-slate-700">
                      <tr>
                        <th className="p-3">Period</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Rating (/5)</th>
                        <th className="p-3">Goals Done (%)</th>
                        <th className="p-3">Appraisal Summary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-200 font-metric">
                      {employeeData.reviews.map((r) => (
                        <tr key={r.review_id}>
                          <td className="p-3 font-bold text-slate-900 dark:text-white print:text-slate-900">{r.review_period}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{r.review_date}</td>
                          <td className="p-3 font-bold text-blue-600 dark:text-cyan-400 print:text-blue-700">{r.rating_out_of_5}</td>
                          <td className="p-3 font-semibold text-cyan-600 dark:text-cyan-400 print:text-cyan-700">{r.goals_completed_percent}%</td>
                          <td className="p-3 font-sans text-slate-700 dark:text-slate-300 print:text-slate-700">{r.review_summary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= REPORT TYPE: OVERVIEW ================= */}
          {reportType === "overview" && overviewData && (
            <div className="space-y-6">
              {/* Executive Summary Metrics */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">
                  Company-Wide Benchmark Scorecards
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl border bg-white border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 print:bg-white print:border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Total Workforce</span>
                    <p className="text-2xl font-black font-metric mt-1 text-blue-600 dark:text-cyan-400 print:text-blue-700">
                      {overviewData.kpis.total_employees}
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{overviewData.kpis.active_employees} active status</span>
                  </div>

                  <div className="p-4 rounded-xl border bg-white border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 print:bg-white print:border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Avg Appraisal Rating</span>
                    <p className="text-2xl font-black font-metric mt-1 text-amber-500 dark:text-amber-400 print:text-amber-600">
                      {overviewData.kpis.avg_review_rating} <span className="text-xs font-medium text-slate-400">/ 5.0</span>
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{overviewData.kpis.total_reviews} total reviews</span>
                  </div>

                  <div className="p-4 rounded-xl border bg-white border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 print:bg-white print:border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Avg Attendance</span>
                    <p className="text-2xl font-black font-metric mt-1 text-emerald-600 dark:text-emerald-400 print:text-emerald-700">
                      {overviewData.kpis.avg_attendance_rate}%
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Absenteeism: {overviewData.kpis.avg_absenteeism_rate}%</span>
                  </div>

                  <div className="p-4 rounded-xl border bg-white border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 print:bg-white print:border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">On-Time Tasks</span>
                    <p className="text-2xl font-black font-metric mt-1 text-teal-600 dark:text-teal-400 print:text-teal-700">
                      {overviewData.kpis.on_time_completion_rate}%
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{overviewData.kpis.completed_tasks} completed</span>
                  </div>
                </div>
              </div>

              {/* Department Benchmarks */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500 dark:text-slate-400">
                  Departmental Breakdown Summary
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400 print:bg-slate-100 print:text-slate-700">
                      <tr>
                        <th className="p-3">Department</th>
                        <th className="p-3 text-right">Headcount</th>
                        <th className="p-3 text-right">Avg Rating</th>
                        <th className="p-3 text-right">Goals Done</th>
                        <th className="p-3 text-right">Attendance</th>
                        <th className="p-3 text-right">Tasks</th>
                        <th className="p-3 text-right">On-Time %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-200 font-metric">
                      {overviewData.deptBreakdown.map((row) => (
                        <tr key={row.department}>
                          <td className="p-3 font-bold font-sans text-slate-900 dark:text-white print:text-slate-900">{row.department}</td>
                          <td className="p-3 text-right text-slate-700 dark:text-slate-300 print:text-slate-700">{row.employee_count}</td>
                          <td className="p-3 text-right font-bold text-blue-600 dark:text-cyan-400 print:text-blue-700">{row.avg_rating}</td>
                          <td className="p-3 text-right text-slate-700 dark:text-slate-300 print:text-slate-700">{row.avg_goals_completed}%</td>
                          <td className="p-3 text-right font-semibold text-emerald-600 dark:text-emerald-400 print:text-emerald-700">{row.avg_attendance_rate}%</td>
                          <td className="p-3 text-right text-slate-600 dark:text-slate-400 print:text-slate-600">{row.total_tasks}</td>
                          <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-200 print:text-slate-900">{row.on_time_rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Document Sign-off Footer */}
          <div className="mt-10 pt-6 border-t text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400 print:border-slate-200 print:text-slate-500">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 print:text-slate-800">HR Analytics & Performance Intelligence System</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 print:text-slate-400">Confidential • For Internal Corporate Review Only</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 print:text-slate-700">Audit Status: Verified</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 print:text-slate-400">Timestamp: {new Date().toISOString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
