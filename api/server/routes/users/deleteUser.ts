import { Router } from "express";
import { OkPacketParams } from "mysql2";
import { getMySqlPool } from "../../../db/mysql/connections.js";

const deleteUser = Router();

deleteUser.post("/", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User id is required" });
  }

  try {
    const pool = await getMySqlPool();
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [
      userId,
    ]);

    if ((result as OkPacketParams)?.affectedRows === 0) {
      return res
        .status(400)
        .json({ success: false, message: "⚠️ No user found with that ID." });
    }
  } catch (err) {
    console.error("❌ Failed to delete user:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }

  res.json({
    success: true,
    message: `🗑️ Deleted user with ID: ${userId}`,
    params: {},
  });
});

export default deleteUser;
