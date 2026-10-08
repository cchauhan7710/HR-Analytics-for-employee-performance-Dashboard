import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Scale, Sparkles } from "lucide-react";

export default function MetricDefinitions({ isDark = true }) {
  const [isOpen, setIsOpen] = useState(false);

  const definitions = [
    {
      name: "Review Rating",
      unit: "1.0 - 5.0 scale",
      formula: "Appraisal Score recorded on half-yearly review",
      note: "Standard corporate performance grade (1 = Needs Improvement, 3 = Meets Expectations, 5 = Exceptional).",
      accent: "border-blue-200/80 bg-blue-50/50 text-blue-700 dark:border-blue-800/80 dark:bg-blue-950/50 dark:text-blue-300",
    },
    {
      name: "Goals Completed",
      unit: "Percentage (%)",
      formula: "(Completed Key Goals / Assigned Goals) × 100",
      note: "Measures milestone progress within the review period.",
      accent: "border-cyan-200/80 bg-cyan-50/50 text-cyan-700 dark:border-cyan-800/80 dark:bg-cyan-950/50 dark:text-cyan-300",
    },
    {
      name: "Attendance Rate",
      unit: "Percentage (%)",
      formula: "(Present Days / Working Days) × 100",
      note: "Reflects actual physical or logged presence. Approved leaves are tracked separately.",
      accent: "border-emerald-200/80 bg-emerald-50/50 text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/50 dark:text-emerald-300",
    },
    {
      name: "Absenteeism Rate",
      unit: "Percentage (%)",
      formula: "(Absent Days / Working Days) × 100",
      note: "Tracks unapproved or unplanned absence impact on operations.",
      accent: "border-amber-200/80 bg-amber-50/50 text-amber-700 dark:border-amber-800/80 dark:bg-amber-950/50 dark:text-amber-300",
    },
    {
      name: "Task Turnaround Speed",
      unit: "Calendar Days",
      formula: "Completed Date - Assigned Date",
      note: "Operational turnaround speed. Higher duration can reflect complex enterprise initiatives.",
      accent: "border-teal-200/80 bg-teal-50/50 text-teal-700 dark:border-teal-800/80 dark:bg-teal-950/50 dark:text-teal-300",
    },
    {
      name: "On-Time Completion Rate",
      unit: "Percentage (%)",
      formula: "(Tasks completed on/before Due Date / Total Completed Tasks) × 100",
      note: "Measures delivery reliability and operational adherence.",
      accent: "border-sky-200/80 bg-sky-50/50 text-sky-700 dark:border-sky-800/80 dark:bg-sky-950/50 dark:text-sky-300",
    },
  ];

  return (
    <div className="rounded-2xl border backdrop-blur-xl overflow-hidden mb-6 transition-all duration-300 bg-white/95 border-slate-200/90 dark:bg-slate-900/75 dark:border-slate-800/90 shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left font-semibold transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30 shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Metric Definitions & Interpretation Guidelines
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                KPI Formulas
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              Click to {isOpen ? "collapse" : "view"} formula breakdowns and analytical principles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80">
            {isOpen ? (
              <>
                <span>Hide Details</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Show Details</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="px-5 sm:px-6 pb-6 pt-3 border-t animate-in fade-in duration-200 border-slate-100 bg-slate-50/40 dark:border-slate-800/80 dark:bg-slate-950/40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {definitions.map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl border shadow-2xs transition-all bg-white border-slate-200/80 dark:bg-slate-900/90 dark:border-slate-800 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    {item.unit}
                  </span>
                </div>
                <p className={`text-xs font-mono p-2 rounded-lg mb-2 border ${item.accent}`}>
                  {item.formula}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-4 text-xs flex items-start gap-3 shadow-2xs border-amber-200/80 bg-amber-50/70 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Analytical Integrity Principle:</span>
              <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-300/90">
                Metrics are intentionally charted in their original units rather than an artificial combined score. Correlation between attendance or task speed and appraisal score does not imply causation. Individual task difficulty and domain expectations must be considered during human evaluations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
