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
      <h3 className="chart-title">Attrition By Age</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={attritionByAge}
          margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
          barCategoryGap="30%"
        >
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
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
            contentStyle={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
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
