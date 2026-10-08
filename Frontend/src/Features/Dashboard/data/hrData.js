// ─── HR Analytics Static Data ─────────────────────────────────────────────────

export const kpiData = [
  { label: "Count of Employees", value: "1470" },
  { label: "Attrition", value: "237" },
  { label: "Attrition Rate", value: "16.1%" },
  { label: "Avg Age", value: "36.92" },
  { label: "Avg Salary", value: "6.50K" },
  { label: "Avg Working Years", value: "7.01" },
];

export const departmentTabs = [
  "Human Resources",
  "Research & Development",
  "Sales",
];

export const attritionByEducation = [
  { name: "Life Sciences", value: 38, color: "#4ade80" },
  { name: "Medical", value: 27, color: "#facc15" },
  { name: "Marketing", value: 15, color: "#f97316" },
  { name: "Technical Degree", value: 14, color: "#818cf8" },
  { name: "Other", value: 5, color: "#f472b6" },
  { name: "Human Resources", value: 3, color: "#22d3ee" },
];

export const attritionByAge = [
  { age: "26-35", count: 116, fill: "#3b82f6" },
  { age: "18-25", count: 44, fill: "#4ade80" },
  { age: "36-45", count: 43, fill: "#f97316" },
  { age: "46-55", count: 26, fill: "#facc15" },
  { age: "55+", count: 8, fill: "#f9a8d4" },
];

export const jobSatisfactionData = [
  {
    role: "Healthcare Representative",
    s1: 2, s2: 2, s3: 1, s4: 4, total: 9,
  },
  { role: "Human Resources", s1: 5, s2: 2, s3: 3, s4: 2, total: 12 },
  { role: "Laboratory Technician", s1: 20, s2: 8, s3: 21, s4: 13, total: 62 },
  { role: "Manager", s1: 1, s2: 2, s3: 1, s4: 1, total: 5 },
  {
    role: "Manufacturing Director",
    s1: 2, s2: 2, s3: 4, s4: 2, total: 10,
  },
  { role: "Research Director", s1: 0, s2: 1, s3: 1, s4: 0, total: 2 },
  { role: "Research Scientist", s1: 13, s2: 10, s3: 15, s4: 9, total: 47 },
  { role: "Sales Executive", s1: 16, s2: 9, s3: 18, s4: 14, total: 57 },
  {
    role: "Sales Representative",
    s1: 7, s2: 10, s3: 9, s4: 7, total: 33,
  },
  { role: "Total", s1: 66, s2: 46, s3: 73, s4: 52, total: 237, isTotal: true },
];

export const attritionBySalary = [
  { slab: "Upto 5k", count: 163, fill: "#3b82f6" },
  { slab: "5k-10k", count: 49, fill: "#4ade80" },
  { slab: "10k-15k", count: 20, fill: "#f97316" },
  { slab: "15k+", count: 5, fill: "#facc15" },
];

export const attritionByYears = [
  { year: 0, count: 16 },
  { year: 1, count: 59 },
  { year: 2, count: 19 },
  { year: 3, count: 8 },
  { year: 4, count: 5 },
  { year: 5, count: 18 },
  { year: 6, count: 4 },
  { year: 7, count: 8 },
  { year: 8, count: 0 },
  { year: 9, count: 0 },
  { year: 10, count: 18 },
  { year: 11, count: 0 },
  { year: 12, count: 2 },
];

export const attritionByJobRole = [
  { role: "Laboratory Technician", count: 62, fill: "#3b82f6" },
  { role: "Sales Executive", count: 57, fill: "#4ade80" },
  { role: "Research Scientist", count: 47, fill: "#f97316" },
  { role: "Sales Representative", count: 33, fill: "#facc15" },
];

export const genderData = [
  { name: "Male", value: 150, color: "#3b82f6" },
  { name: "Female", value: 87, color: "#a78bfa" },
];
