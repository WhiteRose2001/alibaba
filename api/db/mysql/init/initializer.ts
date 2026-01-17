import { Pool } from "mysql2/promise";
import { prepareUsersSchema } from "./tables/prepareUserSchema.js";
import { prepareFilesSchema } from "./tables/prepareFilesSchema.js";
import dotenv from "dotenv";

dotenv.config();

export const initializeMySqlDB = async (pool: Pool) => {
  const dbName = process.env.DB_NAME;
  await pool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await pool.query(`USE \`${dbName}\`;`);
  console.log("✅ Using schema:", dbName);
  const checkTable = async (tableName: string) =>
    await tableExists(pool, tableName);
  if (!(await checkTable("users"))) {
    await prepareUsersSchema();
  }
  if (!(await checkTable("files"))) {
    await prepareFilesSchema();
  }
};

async function tableExists(pool: Pool, tableName: string) {
  try {
    const query = `SELECT 1 FROM ${tableName} LIMIT 1;`;
    await pool.execute(query);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.log(`ℹ️ Table "${tableName}" does not exist.`);
    return false;
  }
}
