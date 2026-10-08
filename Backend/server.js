import "dotenv/config";
import pool from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Is Running On The PORT: ${PORT}`);
});
