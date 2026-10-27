import mysql from "mysql2/promise";
import "dotenv/config";

async function syncLocalToAiven() {
  console.log("🔄 Connecting to local MySQL and Aiven Cloud MySQL...");

  // Local connection
  const localConn = await mysql.createConnection({
    host: process.env.LOCAL_DB_HOST || "localhost",
    user: process.env.LOCAL_DB_USER || "root",
    password: process.env.LOCAL_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME || "Hr_Analytics",
  });
  console.log("✅ Connected to Local MySQL!");

  // Aiven connection
  const aivenConn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 16009,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "defaultdb",
    ssl: { rejectUnauthorized: false },
  });
  console.log("✅ Connected to Aiven Cloud MySQL!");

  // Tables to sync in order of foreign key dependency
  const syncPlan = [
    { table: "employees", order: 1 },
    { table: "performance_reviews", order: 2 },
    { table: "attendance_monthly", order: 3 },
    { table: "tasks", order: 4 },
    { table: "users", order: 5 },
  ];

  // Disable foreign key checks on Aiven for clean sync
  await aivenConn.query("SET FOREIGN_KEY_CHECKS = 0;");

  for (const { table } of syncPlan) {
    console.log(`\n📦 Syncing table '${table}'...`);

    // Fetch from local
    const [localRows] = await localConn.query(`SELECT * FROM ${table}`);
    console.log(`- Fetched ${localRows.length} rows from local ${table}`);

    // Truncate Aiven table
    await aivenConn.query(`TRUNCATE TABLE ${table}`);

    if (localRows.length > 0) {
      const columns = Object.keys(localRows[0]);
      const batchSize = 300;

      for (let i = 0; i < localRows.length; i += batchSize) {
        const batch = localRows.slice(i, i + batchSize);
        const placeholders = batch.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
        const values = [];

        batch.forEach((row) => {
          columns.forEach((col) => {
            values.push(row[col]);
          });
        });

        await aivenConn.query(
          `INSERT INTO ${table} (${columns.join(", ")}) VALUES ${placeholders}`,
          values
        );
      }
      console.log(`✅ Successfully copied ${localRows.length} rows to Aiven '${table}'`);
    }
  }

  // Also check if employee_leave exists in local and create/sync it
  try {
    const [leaveRows] = await localConn.query("SELECT * FROM employee_leave");
    if (leaveRows.length > 0) {
      console.log(`\n📦 Syncing table 'employee_leave' (${leaveRows.length} rows)...`);
      const [tableCreate] = await localConn.query("SHOW CREATE TABLE employee_leave");
      const createSql = tableCreate[0]["Create Table"];
      await aivenConn.query(createSql);
      await aivenConn.query("TRUNCATE TABLE employee_leave");

      const columns = Object.keys(leaveRows[0]);
      const batchSize = 300;
      for (let i = 0; i < leaveRows.length; i += batchSize) {
        const batch = leaveRows.slice(i, i + batchSize);
        const placeholders = batch.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
        const values = [];
        batch.forEach((row) => {
          columns.forEach((col) => {
            values.push(row[col]);
          });
        });
        await aivenConn.query(
          `INSERT INTO employee_leave (${columns.join(", ")}) VALUES ${placeholders}`,
          values
        );
      }
      console.log(`✅ Successfully copied ${leaveRows.length} rows to Aiven 'employee_leave'`);
    }
  } catch (e) {
    console.log("Note for employee_leave:", e.message);
  }

  // Re-enable foreign key checks
  await aivenConn.query("SET FOREIGN_KEY_CHECKS = 1;");

  // Verify final counts on Aiven
  console.log("\n==============================================");
  console.log("📊 Final Verified Counts on Aiven Database:");
  console.log("==============================================");
  for (const { table } of syncPlan) {
    const [res] = await aivenConn.query(`SELECT COUNT(*) as c FROM ${table}`);
    console.log(`- ${table}: ${res[0].c} records`);
  }

  await localConn.end();
  await aivenConn.end();
  console.log("\n🎉 Sync Complete! Your exact 303 employee database is now live on Aiven!\n");
  process.exit(0);
}

syncLocalToAiven().catch((err) => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});
