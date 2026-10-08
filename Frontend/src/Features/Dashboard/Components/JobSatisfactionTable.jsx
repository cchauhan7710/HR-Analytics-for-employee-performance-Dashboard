import React from "react";
import { jobSatisfactionData } from "../data/hrData";

const JobSatisfactionTable = () => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Job Satisfaction</h3>
      <div className="js-table-wrapper">
        <table className="js-table">
          <thead>
            <tr>
              <th className="js-th js-role-col">JobRole</th>
              <th className="js-th js-num-col">1</th>
              <th className="js-th js-num-col">2</th>
              <th className="js-th js-num-col">3</th>
              <th className="js-th js-num-col">4</th>
              <th className="js-th js-num-col js-total-header">Total</th>
            </tr>
          </thead>
          <tbody>
            {jobSatisfactionData.map((row, idx) => (
              <tr
                key={idx}
                className={row.isTotal ? "js-total-row" : "js-data-row"}
              >
                <td className="js-td js-role-td">{row.role}</td>
                <td className="js-td js-num-td">{row.s1}</td>
                <td className="js-td js-num-td">{row.s2}</td>
                <td className="js-td js-num-td">{row.s3}</td>
                <td className="js-td js-num-td">{row.s4}</td>
                <td className="js-td js-num-td js-total-cell">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobSatisfactionTable;
