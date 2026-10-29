import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { attritionByYears } from "../data/hrData";

const LABELS = [
  { year: 0, count: 16 },
  { year: 2, count: 19 },
  { year: 5, count: 18 },
  { year: 8, count: 0 },
  { year: 10, count: 0 },
  { year: 12, count: 2 },
];

const YearsArea = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Attrition By Years At Company</h3>
        <span className="chart-badge">Tenure</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart
          data={attritionByYears}
          margin={{ top: 15, right: 20, left: -20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="yearsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c9ae8a" stopOpacity={0.42} />
              <stop offset="55%" stopColor="#b08967" stopOpacity={0.24} />
              <stop offset="100%" stopColor="#b08967" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.28)" strokeDasharray="4 4" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 65]}
          />
          <Tooltip
            cursor={{ stroke: "#0d2d5f", strokeDasharray: "4 4" }}
            contentStyle={{
              background: "rgba(15,23,42,0.96)",
              border: "1px solid rgba(148,163,184,0.28)",
              borderRadius: 14,
              padding: "10px 12px",
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
              color: "#e2e8f0",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.25)",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8d7158"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#yearsGrad)"
            fillOpacity={1}
            dot={false}
            activeDot={{ r: 5, fill: "#8d7158", stroke: "#fff", strokeWidth: 2 }}
          />
          {LABELS.map((pt) => (
            <ReferenceDot
              key={pt.year}
              x={pt.year}
              y={pt.count}
              r={0}
              label={{
                value: pt.count,
                position: "top",
                fontSize: 10,
                fontFamily: "Inter, sans-serif",
                fill: "#334155",
                fontWeight: 600,
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearsArea;
