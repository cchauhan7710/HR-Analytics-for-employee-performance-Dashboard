/**
 * Migration: Add user_id scoping to HR tables + seed the Rahul master account
 *
 * Run once:  node Backend/src/database/addUserScope.js
 */
import pool from "../../config/db.js";
import bcrypt from "bcryptjs";

async function migrate() {
  console.log("▶ Starting user-scope migration...\n");

  // ── 1. Ensure users table has correct shape ──────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(150) NOT NULL,
      email       VARCHAR(255) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,
      role        ENUM('admin','hr_manager','viewer') NOT NULL DEFAULT 'admin',
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log("✅  users table ready");

  // ── 2. Add user_id FK column to employees (nullable for backward compat) ──
  const [[{ colExists: empCol }]] = await pool.query(`
    SELECT COUNT(*) AS colExists
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'employees'
      AND COLUMN_NAME  = 'user_id'
  `);
  if (!empCol) {
    await pool.query(`ALTER TABLE employees ADD COLUMN user_id INT NULL`);
    console.log("✅  employees.user_id column added");
  } else {
    console.log("⏭  employees.user_id already exists");
  }

  // ── 3. Seed / upsert the Rahul master account ────────────────────────────
  const MASTER_EMAIL = "rahulchauhaninbox@gmail.com";
  const MASTER_PASS  = "123456789";
  const MASTER_NAME  = "Rahul Chauhan";
  const MASTER_ROLE  = "admin";

  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [MASTER_EMAIL]
  );

  let masterId;
  if (existing.length) {
    masterId = existing[0].id;
    // Update password in case it was changed
    const hash = await bcrypt.hash(MASTER_PASS, 10);
    await pool.query("UPDATE users SET password = ?, role = ? WHERE id = ?", [
      hash, MASTER_ROLE, masterId,
    ]);
    console.log(`✅  Master account updated  (id=${masterId})`);
  } else {
    const hash = await bcrypt.hash(MASTER_PASS, 10);
    const [res] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [MASTER_NAME, MASTER_EMAIL, hash, MASTER_ROLE]
    );
    masterId = res.insertId;
    console.log(`✅  Master account created  (id=${masterId})`);
  }

  // ── 4. Assign all existing un-owned employees to the master account ───────
  const [[{ unowned }]] = await pool.query(
    "SELECT COUNT(*) AS unowned FROM employees WHERE user_id IS NULL"
  );
  if (unowned > 0) {
    await pool.query(
      "UPDATE employees SET user_id = ? WHERE user_id IS NULL",
      [masterId]
    );
    console.log(`✅  Assigned ${unowned} existing employees → user_id=${masterId}`);
  } else {
    console.log("⏭  All employees already have user_id");
  }

  // ── 5. Create index for fast per-user queries ─────────────────────────────
  try {
    await pool.query(
      "CREATE INDEX idx_emp_user ON employees (user_id)"
    );
    console.log("✅  Index idx_emp_user created");
  } catch {
    console.log("⏭  Index idx_emp_user already exists");
  }

  console.log("\n🎉  Migration complete!");
  console.log(`   Master account: ${MASTER_EMAIL} / ${MASTER_PASS}  (role: ${MASTER_ROLE})`);
  console.log(`   Master user id: ${masterId}`);
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  });
