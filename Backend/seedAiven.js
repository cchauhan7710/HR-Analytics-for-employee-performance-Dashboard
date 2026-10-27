import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import pool from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datasetDir = path.resolve(__dirname, "../synthetic_hr_dataset");

async function parseCsv(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const rows = [];
  let headers = null;

  for await (const line of rl) {
    if (!line.trim()) continue;
    const parts = line.split(",").map((s) => s.trim());
    if (!headers) {
      headers = parts;
    } else {
      const row = {};
      headers.forEach((h, i) => {
        row[h] = parts[i] !== undefined && parts[i] !== "" ? parts[i] : null;
      });
      rows.push(row);
    }
  }
  return rows;
}

async function runMigration() {
  console.log("🚀 Starting database schema initialization & seeding on Aiven...");

  // 1. Create Tables
  console.log("Creating tables...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      employee_id VARCHAR(50) NOT NULL,
      department VARCHAR(100) NOT NULL,
      job_title VARCHAR(100) NOT NULL,
      date_joined DATE NOT NULL,
      employment_status VARCHAR(50) NOT NULL DEFAULT 'Active',
      PRIMARY KEY (employee_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS performance_reviews (
      review_id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id VARCHAR(50) NOT NULL,
      review_date DATE NOT NULL,
      review_period VARCHAR(20) NOT NULL,
      rating_out_of_5 DECIMAL(3, 2) NOT NULL,
      goals_completed_percent DECIMAL(5, 2) NOT NULL,
      review_summary TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_perf_emp (employee_id),
      INDEX idx_perf_period (review_period),
      CONSTRAINT fk_perf_employee 
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) 
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance_monthly (
      attendance_id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id VARCHAR(50) NOT NULL,
      month VARCHAR(7) NOT NULL,
      working_days INT NOT NULL,
      present_days INT NOT NULL,
      absent_days INT NOT NULL,
      leave_days INT NOT NULL,
      attendance_rate_percent DECIMAL(5, 2) NOT NULL,
      absenteeism_rate_percent DECIMAL(5, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_att_emp (employee_id),
      INDEX idx_att_month (month),
      CONSTRAINT fk_att_employee 
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) 
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      task_id VARCHAR(50) NOT NULL,
      employee_id VARCHAR(50) NOT NULL,
      assigned_date DATE NOT NULL,
      due_date DATE NOT NULL,
      completed_date DATE NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'In Progress',
      priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (task_id),
      INDEX idx_tasks_emp (employee_id),
      INDEX idx_tasks_status (status),
      CONSTRAINT fk_tasks_employee 
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) 
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'viewer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS token_blacklist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log("✅ Tables created successfully!");

  // Helper for batch insert
  async function batchInsert(table, columns, rows, batchSize = 300) {
    for (let i = 0; i < rows.length; i += batchSize) {
      const slice = rows.slice(i, i + batchSize);
      const placeholders = slice.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
      const values = [];
      slice.forEach((row) => {
        columns.forEach((col) => {
          values.push(row[col]);
        });
      });
      const query = `INSERT IGNORE INTO ${table} (${columns.join(", ")}) VALUES ${placeholders}`;
      await pool.query(query, values);
    }
  }

  // 2. Seed Employees
  console.log("📥 Seeding employees.csv...");
  const employees = await parseCsv(path.join(datasetDir, "employees.csv"));
  await batchInsert("employees", ["employee_id", "department", "job_title", "date_joined", "employment_status"], employees);
  console.log(`✅ Loaded ${employees.length} employees`);

  // 3. Seed Performance Reviews
  console.log("📥 Seeding performance_reviews.csv...");
  const reviews = await parseCsv(path.join(datasetDir, "performance_reviews.csv"));
  await batchInsert(
    "performance_reviews",
    ["employee_id", "review_date", "review_period", "rating_out_of_5", "goals_completed_percent", "review_summary"],
    reviews
  );
  console.log(`✅ Loaded ${reviews.length} performance reviews`);

  // 4. Seed Attendance Monthly
  console.log("📥 Seeding attendance_monthly.csv...");
  const attendance = await parseCsv(path.join(datasetDir, "attendance_monthly.csv"));
  await batchInsert(
    "attendance_monthly",
    [
      "employee_id",
      "month",
      "working_days",
      "present_days",
      "absent_days",
      "leave_days",
      "attendance_rate_percent",
      "absenteeism_rate_percent",
    ],
    attendance
  );
  console.log(`✅ Loaded ${attendance.length} monthly attendance rows`);

  // 5. Seed Tasks
  console.log("📥 Seeding tasks.csv...");
  const tasks = await parseCsv(path.join(datasetDir, "tasks.csv"));
  await batchInsert(
    "tasks",
    ["task_id", "employee_id", "assigned_date", "due_date", "completed_date", "status", "priority"],
    tasks
  );
  console.log(`✅ Loaded ${tasks.length} tasks`);

  // 6. Create default demo admin user if not present
  const [existingUser] = await pool.query("SELECT id FROM users WHERE email = 'admin@company.com'");
  if (existingUser.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Password123!", salt);
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["HR Administrator", "admin@company.com", hashedPassword, "admin"]
    );
    console.log("✅ Created default admin account: admin@company.com / Password123!");
  }

  // Verify counts
  const [empCount] = await pool.query("SELECT COUNT(*) as c FROM employees");
  const [revCount] = await pool.query("SELECT COUNT(*) as c FROM performance_reviews");
  const [attCount] = await pool.query("SELECT COUNT(*) as c FROM attendance_monthly");
  const [taskCount] = await pool.query("SELECT COUNT(*) as c FROM tasks");
  const [userCount] = await pool.query("SELECT COUNT(*) as c FROM users");

  console.log("\n🎉 Aiven Database Migration Completed Successfully!");
  console.log(`- Employees: ${empCount[0].c}`);
  console.log(`- Performance Reviews: ${revCount[0].c}`);
  console.log(`- Attendance Records: ${attCount[0].c}`);
  console.log(`- Operational Tasks: ${taskCount[0].c}`);
  console.log(`- System Users: ${userCount[0].c}\n`);

  process.exit(0);
}

runMigration().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
