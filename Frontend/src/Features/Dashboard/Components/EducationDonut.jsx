import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { attritionByEducation } from "../data/hrData";

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}) => {
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.06) return null;
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={10}
      fill="#334155"
      fontFamily="Inter, sans-serif"
    >
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
};

const EducationDonut = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Attrition By Education</h3>
        <span className="chart-badge">Study</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={attritionByEducation}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={82}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            stroke="#fff"
            strokeWidth={2}
            label={renderCustomLabel}
          >
            {attritionByEducation.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
            formatter={(value, name) => [`${value}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EducationDonut;
