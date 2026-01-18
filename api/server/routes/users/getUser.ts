import { Router } from "express";
import { getMySqlPool } from "../../../db/mysql/connections.js";

const getUser = Router();

export async function getUserByLogin(login: string) {
  const pool = await getMySqlPool();
  const [rows] = await pool.execute(
    "SELECT id, password_hash, login FROM users WHERE login = ?",
    [login],
  );
  return Array.isArray(rows) ? rows[0] : (rows ?? null);
}

getUser.post("/", async (req, res) => {
  const { login } = req.body;
  if (!login) {
    return res
      .status(400)
      .json({ success: false, message: "User login is required" });
  }
  try {
    const user = (await getUserByLogin(login)) as any[];
    if (!user) {
      return res
        .status(404)
        .json({ success: true, message: "User not found", ok: true });
    }
    return res.json({
      success: true,
      message: `Sending user with login: ${login}`,
      data: user[0],
    });
  } catch (err) {
    console.error(`❌ Failed to get user: ${login}`, err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

export default getUser;
