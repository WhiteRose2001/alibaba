import { getMySqlPool } from "../../connections.js";

export async function prepareUsersSchema() {
  const pool = await getMySqlPool();
  console.log("🔧 Preparing Users schema...");
  await pool.query(`
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `);

  console.log("✅ Tags schema prepared.");
}
