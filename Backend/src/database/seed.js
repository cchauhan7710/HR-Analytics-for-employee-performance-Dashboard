import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_DIR = path.resolve(__dirname, "../../../synthetic_hr_dataset");

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    // Basic CSV splitting (dataset contains clean commas, no quoted commas)
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] === "" ? null : values[idx];
      });
      rows.push(row);
    }
  }
  return rows;
}

export async function initAndSeedDatabase() {
  console.log("Checking and initializing HR Analytics tables...");

  // 1. Create tables
  const schemaSQL = fs.readFileSync(path.join(CSV_DIR, "schema.sql"), "utf-8");
  // Remove block comments and line comments
  const cleanSQL = schemaSQL
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/--.*$/gm, "");

  const statements = cleanSQL
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await pool.query(stmt);
  }
  console.log("Database schema checked/created successfully.");

  // 2. Check and seed employees
  const [[{ count: empCount }]] = await pool.query(
    "SELECT COUNT(*) AS count FROM employees"
  );
  if (empCount === 0) {
    console.log("Importing employees.csv...");
    const employees = parseCSV(path.join(CSV_DIR, "employees.csv"));
    for (const emp of employees) {
      await pool.query(
        `INSERT INTO employees (employee_id, department, job_title, date_joined, employment_status)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE department=VALUES(department), job_title=VALUES(job_title), employment_status=VALUES(employment_status)`,
        [emp.employee_id, emp.department, emp.job_title, emp.date_joined, emp.employment_status]
      );
    }
    console.log(`Imported ${employees.length} employees.`);
  } else {
    console.log(`Employees table already has ${empCount} records.`);
  }

  // 3. Check and seed performance_reviews
  const [[{ count: reviewCount }]] = await pool.query(
    "SELECT COUNT(*) AS count FROM performance_reviews"
  );
  if (reviewCount === 0) {
    console.log("Importing performance_reviews.csv...");
    const reviews = parseCSV(path.join(CSV_DIR, "performance_reviews.csv"));
    // Batch insert in chunks of 200
    for (let i = 0; i < reviews.length; i += 200) {
      const chunk = reviews.slice(i, i + 200);
      const values = chunk.map((r) => [
        r.employee_id,
        r.review_date,
        r.review_period,
        parseFloat(r.rating_out_of_5),
        parseFloat(r.goals_completed_percent),
        r.review_summary,
      ]);
      await pool.query(
        `INSERT INTO performance_reviews (employee_id, review_date, review_period, rating_out_of_5, goals_completed_percent, review_summary)
         VALUES ?`,
        [values]
      );
    }
    console.log(`Imported ${reviews.length} performance reviews.`);
  } else {
    console.log(`Performance reviews table already has ${reviewCount} records.`);
  }

  // 4. Check and seed attendance_monthly
  const [[{ count: attCount }]] = await pool.query(
    "SELECT COUNT(*) AS count FROM attendance_monthly"
  );
  if (attCount === 0) {
    console.log("Importing attendance_monthly.csv...");
    const attendance = parseCSV(path.join(CSV_DIR, "attendance_monthly.csv"));
    for (let i = 0; i < attendance.length; i += 200) {
      const chunk = attendance.slice(i, i + 200);
      const values = chunk.map((a) => [
        a.employee_id,
        a.month,
        parseInt(a.working_days, 10),
        parseInt(a.present_days, 10),
        parseInt(a.absent_days, 10),
        parseInt(a.leave_days, 10),
        parseFloat(a.attendance_rate_percent),
        parseFloat(a.absenteeism_rate_percent),
      ]);
      await pool.query(
        `INSERT INTO attendance_monthly (employee_id, month, working_days, present_days, absent_days, leave_days, attendance_rate_percent, absenteeism_rate_percent)
         VALUES ?`,
        [values]
      );
    }
    console.log(`Imported ${attendance.length} monthly attendance records.`);
  } else {
    console.log(`Attendance monthly table already has ${attCount} records.`);
  }

  // 5. Check and seed tasks
  const [[{ count: taskCount }]] = await pool.query(
    "SELECT COUNT(*) AS count FROM tasks"
  );
  if (taskCount === 0) {
    console.log("Importing tasks.csv...");
    const tasks = parseCSV(path.join(CSV_DIR, "tasks.csv"));
    for (let i = 0; i < tasks.length; i += 200) {
      const chunk = tasks.slice(i, i + 200);
      const values = chunk.map((t) => [
        t.task_id,
        t.employee_id,
        t.assigned_date,
        t.due_date,
        t.completed_date || null,
        t.status,
        t.priority,
      ]);
      await pool.query(
        `INSERT INTO tasks (task_id, employee_id, assigned_date, due_date, completed_date, status, priority)
         VALUES ?`,
        [values]
      );
    }
    console.log(`Imported ${tasks.length} tasks.`);
  } else {
    console.log(`Tasks table already has ${taskCount} records.`);
  }

  console.log("All tables and seed data ready!");
}

// Allow direct CLI execution: node seed.js
if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  initAndSeedDatabase()
    .then(() => {
      console.log("Seeding complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding error:", err);
      process.exit(1);
    });
}
