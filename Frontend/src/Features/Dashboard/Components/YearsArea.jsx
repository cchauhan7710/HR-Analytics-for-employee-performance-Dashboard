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
      <h3 className="chart-title">Attrition By Years At Company</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart
          data={attritionByYears}
          margin={{ top: 15, right: 20, left: -20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="yearsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
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
            contentStyle={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#yearsGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#3b82f6" }}
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
