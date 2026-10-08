import React from "react";

const KPICard = ({ label, value }) => {
  return (
    <div className="kpi-card">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
    </div>
  );
};

export default KPICard;
