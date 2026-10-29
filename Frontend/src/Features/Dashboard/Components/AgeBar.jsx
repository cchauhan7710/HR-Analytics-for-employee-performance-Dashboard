import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { attritionByAge } from "../data/hrData";

const AgeBar = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Attrition By Age</h3>
        <span className="chart-badge">Age</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={attritionByAge}
          margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
          barCategoryGap="30%"
        >
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.32)" strokeDasharray="4 4" />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 130]}
          />
          <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.04)" }}
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
          <Bar dataKey="count" radius={[14, 14, 0, 0]} maxBarSize={50}>
            {attritionByAge.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              style={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#334155", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgeBar;
