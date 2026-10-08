import * as kpi from "..models/kpi.model.js";

const wrap = (fn) => async (req, res) => {
  try {
    const data = await fn();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSummary = wrap(kpi.getDashboardSummary);
export const getHeadcount = wrap(kpi.getHeadcountByDepartment);
export const getGender = wrap(kpi.getGenderDistribution);
export const getGrade = wrap(kpi.getGradeDistribution);
export const getAvgCtc = wrap(kpi.getAvgCtcByDepartment);
export const getTurnover = wrap(kpi.getTurnoverRate);
export const getTurnoverDept = wrap(kpi.getTurnoverByDepartment);
export const getExitReasons = wrap(kpi.getExitReasonBreakdown);
export const getAbsenteeism = wrap(kpi.getAbsenteeismRate);
export const getAttendanceTrend = wrap(kpi.getAttendanceTrendByMonth);
export const getPerformanceDist = wrap(kpi.getPerformanceDistribution);
export const getAvgPerformanceDept = wrap(kpi.getAvgPerformanceByDepartment);
export const getTraining = wrap(kpi.getTrainingStats);
export const getLeaveUtil = wrap(kpi.getLeaveUtilization);
export const getNewJoiners = wrap(kpi.getNewJoinersThisYear);
