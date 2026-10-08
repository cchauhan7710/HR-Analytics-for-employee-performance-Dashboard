import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({
  title,
  value,
  unit = "",
  subtitle = "",
  badge = null,
  badgeType = "blue",
  icon = null,
  trend = null,
}) {
  const colorMap = {
    blue: {
      borderHover: "hover:border-blue-400/80 dark:hover:border-blue-500/50",
      iconBg: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30 shadow-blue-500/10",
      accentGlow: "group-hover:bg-blue-500/5 dark:group-hover:bg-blue-500/10",
      badge: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80",
    },
    teal: {
      borderHover: "hover:border-teal-400/80 dark:hover:border-teal-500/50",
      iconBg: "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/30 shadow-teal-500/10",
      accentGlow: "group-hover:bg-teal-500/5 dark:group-hover:bg-teal-500/10",
      badge: "bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/80",
    },
    indigo: {
      borderHover: "hover:border-blue-400/80 dark:hover:border-blue-500/50",
      iconBg: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30 shadow-blue-500/10",
      accentGlow: "group-hover:bg-blue-500/5 dark:group-hover:bg-blue-500/10",
      badge: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80",
    },
    emerald: {
      borderHover: "hover:border-emerald-400/80 dark:hover:border-emerald-500/50",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 shadow-emerald-500/10",
      accentGlow: "group-hover:bg-emerald-500/5 dark:group-hover:bg-emerald-500/10",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80",
    },
    amber: {
      borderHover: "hover:border-amber-400/80 dark:hover:border-amber-500/50",
      iconBg: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30 shadow-amber-500/10",
      accentGlow: "group-hover:bg-amber-500/5 dark:group-hover:bg-amber-500/10",
      badge: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80",
    },
    sky: {
      borderHover: "hover:border-sky-400/80 dark:hover:border-sky-500/50",
      iconBg: "bg-sky-50 text-sky-600 border-sky-100 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30 shadow-cyan-500/10",
      accentGlow: "group-hover:bg-sky-500/5 dark:group-hover:bg-cyan-500/10",
      badge: "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/80",
    },
    purple: {
      borderHover: "hover:border-teal-400/80 dark:hover:border-teal-500/50",
      iconBg: "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/30 shadow-teal-500/10",
      accentGlow: "group-hover:bg-teal-500/5 dark:group-hover:bg-teal-500/10",
      badge: "bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/80",
    },
  };

  const currentTheme = colorMap[badgeType] || colorMap.blue;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-5 border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white/95 border-slate-200/90 shadow-xs dark:bg-slate-900/75 dark:border-slate-800/90 dark:shadow-2xl dark:shadow-black/50 ${currentTheme.borderHover}`}
    >
      {/* Background glow accent on hover */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${currentTheme.accentGlow}`}
      />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-metric">
              {value !== null && value !== undefined ? value : "—"}
            </span>
            {unit && (
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-transform duration-300 group-hover:scale-105 ${currentTheme.iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100/90 dark:border-slate-800/80 flex items-center justify-between text-xs gap-2 flex-wrap">
        <span className="truncate max-w-[65%] text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </span>

        {trend && (
          <div
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold border ${
              trend.positive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80"
                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80"
            }`}
          >
            {trend.positive ? (
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            )}
            <span>{trend.value}</span>
          </div>
        )}

        {!trend && badge && (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold border ${currentTheme.badge}`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
