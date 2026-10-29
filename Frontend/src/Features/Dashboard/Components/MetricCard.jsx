import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({
  title,
  value,
  unit = "",
  subtitle = "",
  icon = null,
  trend = null,
  progress = null,
}) {
  const theme = {
    card: "border border-[#2b4e75] bg-gradient-to-br from-[#0d1f35] via-[#102847] to-[#0a1b2f] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_14px_32px_rgba(5,16,28,0.28)]",
    title: "text-slate-300",
    value: "text-white",
    unit: "text-slate-400",
    footer: "text-slate-400",
    iconBg: "bg-[#eaf5ff] text-[#0d2d5f] border border-[#cfe2ff]",
    accent: "from-[#9ad8ff] to-[#7dd3fc]",
  };

  return (
    <div className={`group relative overflow-hidden rounded-[18px] p-4 transition-all duration-300 ${theme.card}`}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.18em] ${theme.title}`}>
            {title}
          </p>

          <div className="flex items-end gap-1.5 flex-wrap">
            <span className={`text-[2rem] sm:text-[2.3rem] font-black leading-none tracking-[-0.06em] ${theme.value}`}>
              {value !== null && value !== undefined ? value : "—"}
            </span>
            {unit && (
              <span className={`pb-1 text-[11px] font-semibold ${theme.unit}`}>
                {unit}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${theme.iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      {progress !== null && progress !== undefined && (
        <div className="relative mt-4 w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/80">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${theme.accent}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      <div className="relative mt-4 flex items-end justify-between gap-2 border-t border-white/10 pt-3">
        <span className={`truncate text-[11px] font-medium ${theme.footer}`}>
          {subtitle}
        </span>

        {trend && (
          <div
            className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${
              trend.positive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}
          >
            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}

