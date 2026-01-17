import { getMySqlPool } from "../../connections.js";

export async function prepareFilesSchema() {
  const pool = await getMySqlPool();
  console.log("🔧 Preparing Files schema...");
  await pool.query(`
CREATE TABLE files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  path VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
  `);

  console.log("✅ User schema prepared.");
}
