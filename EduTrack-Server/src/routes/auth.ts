import express from "express";
import prisma from "../lib/prisma";
import { hashPassword, comparePassword, signToken } from "../lib/jwt";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });
    const token = signToken(user.id);
    res.status(201).json({
      success: true,
      message: "User created",
      data: { token, user: { id: user.id, name: user.name, email: user.email } }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.isDeleted) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = signToken(user.id);
    res.status(200).json({
      success: true,
      message: "Signed in",
      data: { token, user: { id: user.id, name: user.name, email: user.email } }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
