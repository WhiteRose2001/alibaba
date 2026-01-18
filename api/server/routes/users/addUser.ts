import { Router } from "express";
import { OkPacketParams } from "mysql2";
import bcrypt from "bcrypt";
import { getMySqlPool } from "../../../db/mysql/connections.js";

const addUser = Router();

addUser.post("/", async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Login and password are required" });
  }

  let newUserId = null;

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const pool = await getMySqlPool();
    const [result] = await pool.execute(
      "INSERT INTO users (login, password_hash) VALUES (?, ?)",
      [login, passwordHash],
    );
    newUserId =
      result.constructor.name === "OkPacket"
        ? (result as OkPacketParams)?.insertId
        : null;
  } catch (err: any) {
    console.error("❌ MySQL error during user insert:", err?.message);
    return res.status(500).json({ success: false, message: "Database error" });
  }

  res.json({
    success: true,
    message: "✅ User added successfully",
    params: {
      newUserId,
    },
  });
});

export default addUser;
