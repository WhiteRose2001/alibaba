import { Router } from "express";
import bcrypt from "bcrypt";
import { getUserByLogin } from "./getUser.js";

const loginUser = Router();

loginUser.post("/", async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password)
    return res.status(400).json({ error: "Missing password or login" });

  const user = (await getUserByLogin(login)) as Record<string, any> | null;
  if (!user) return res.status(401).json({ error: "User not found in DB" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const sess = req.session as any;
  sess.userId = user.id;
  sess.login = user.login;

  res.json({ ok: true, userId: user.id, login: user.login });
});

export default loginUser;
