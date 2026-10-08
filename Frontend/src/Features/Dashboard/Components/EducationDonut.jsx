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
      <h3 className="chart-title">Attrition By Education</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={attritionByEducation}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {attritionByEducation.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EducationDonut;
