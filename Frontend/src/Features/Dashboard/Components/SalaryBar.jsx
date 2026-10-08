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
import { attritionBySalary } from "../data/hrData";

const SalaryBar = () => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Attrition By Salary Slab</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          layout="vertical"
          data={attritionBySalary}
          margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
          barCategoryGap="25%"
        >
          <CartesianGrid horizontal={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 200]}
          />
          <YAxis
            type="category"
            dataKey="slab"
            tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#334155" }}
            axisLine={false}
            tickLine={false}
            width={60}
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
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {attritionBySalary.map((entry, index) => (
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

export default SalaryBar;
