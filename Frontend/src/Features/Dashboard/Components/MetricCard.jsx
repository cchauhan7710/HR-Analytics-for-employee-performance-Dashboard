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
  progress = null, // optional number 0-100 for mini progress bar
}) {
  const colorMap = {
    blue: {
      accentGlow: "from-blue-600/10 via-indigo-600/5 to-transparent",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-200/90 shadow-xs dark:bg-gradient-to-br dark:from-blue-500/15 dark:to-indigo-600/15 dark:text-blue-400 dark:border-blue-500/25",
      badge: "bg-blue-50 text-blue-700 border-blue-200/90 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80",
      dot: "bg-blue-500",
      progress: "from-blue-500 to-indigo-600",
    },
    amber: {
      accentGlow: "from-amber-500/10 via-orange-500/5 to-transparent",
      iconBg: "bg-amber-50 text-amber-600 border border-amber-200/90 shadow-xs dark:bg-gradient-to-br dark:from-amber-500/15 dark:to-orange-500/15 dark:text-amber-400 dark:border-amber-500/25",
      badge: "bg-amber-50 text-amber-700 border-amber-200/90 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80",
      dot: "bg-amber-500",
      progress: "from-amber-400 to-amber-600",
    },
    sky: {
      accentGlow: "from-cyan-500/10 via-blue-500/5 to-transparent",
      iconBg: "bg-cyan-50 text-cyan-600 border border-cyan-200/90 shadow-xs dark:bg-gradient-to-br dark:from-cyan-500/15 dark:to-blue-500/15 dark:text-cyan-400 dark:border-cyan-500/25",
      badge: "bg-cyan-50 text-cyan-700 border-cyan-200/90 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/80",
      dot: "bg-cyan-500",
      progress: "from-cyan-400 to-blue-500",
    },
    emerald: {
      accentGlow: "from-emerald-500/10 via-teal-500/5 to-transparent",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/90 shadow-xs dark:bg-gradient-to-br dark:from-emerald-500/15 dark:to-teal-500/15 dark:text-emerald-400 dark:border-emerald-500/25",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/90 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80",
      dot: "bg-emerald-500",
      progress: "from-emerald-400 to-teal-600",
    },
    teal: {
      accentGlow: "from-teal-500/10 via-emerald-500/5 to-transparent",
      iconBg: "bg-teal-50 text-teal-600 border border-teal-200/90 shadow-xs dark:bg-gradient-to-br dark:from-teal-500/15 dark:to-cyan-500/15 dark:text-teal-400 dark:border-teal-500/25",
      badge: "bg-teal-50 text-teal-700 border-teal-200/90 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/80",
      dot: "bg-teal-500",
      progress: "from-teal-400 to-cyan-600",
    },
    purple: {
      accentGlow: "from-purple-500/10 via-indigo-500/5 to-transparent",
      iconBg: "bg-purple-50 text-purple-600 border border-purple-200/90 shadow-xs dark:bg-gradient-to-br dark:from-purple-500/15 dark:to-indigo-500/15 dark:text-purple-400 dark:border-purple-500/25",
      badge: "bg-purple-50 text-purple-700 border-purple-200/90 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80",
      dot: "bg-purple-500",
      progress: "from-purple-500 to-indigo-600",
    },
  };

  const theme = colorMap[badgeType] || colorMap.blue;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 card-specular"
    >
      {/* Subtle top-right ambient glow */}
      <div
        className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-100 ${theme.accentGlow}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-metric">
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
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${theme.iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Mini Progress Bar if progress is provided */}
      {progress !== null && progress !== undefined && (
        <div className="mt-3.5 w-full">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-medium">
            <span>Capacity</span>
            <span className="font-metric font-bold text-slate-600 dark:text-slate-300">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${theme.progress}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Meta Strip */}
      <div className="mt-3.5 pt-3 border-t border-slate-100/90 dark:border-slate-800/80 flex items-center justify-between text-xs gap-2 flex-wrap">
        <span className="truncate max-w-[65%] text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </span>

        {trend && (
          <div
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border ${
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
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border ${theme.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
            <span>{badge}</span>
          </span>
        )}
      </div>
    </div>
  );
}

