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
import { attritionByJobRole } from "../data/hrData";

const JobRoleBar = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Attrition By Job Role</h3>
        <span className="chart-badge">Roles</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          layout="vertical"
          data={attritionByJobRole}
          margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
          barCategoryGap="25%"
        >
          <CartesianGrid horizontal={false} stroke="rgba(148,163,184,0.28)" strokeDasharray="4 4" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 75]}
          />
          <YAxis
            type="category"
            dataKey="role"
            tick={{ fontSize: 10, fontFamily: "Inter, sans-serif", fill: "#334155" }}
            axisLine={false}
            tickLine={false}
            width={130}
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
          <Bar dataKey="count" radius={[0, 14, 14, 0]} maxBarSize={26}>
            {attritionByJobRole.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#334155", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JobRoleBar;
