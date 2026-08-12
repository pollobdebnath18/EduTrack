import express from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middlewares/auth";

const router = express.Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({ where: { isDeleted: false }, select: { id: true, name: true, email: true, createdAt: true } });
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.params.id, isDeleted: false }, select: { id: true, name: true, email: true, createdAt: true } });
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email },
      select: { id: true, name: true, email: true }
    });
    res.json({ success: true, message: "User updated", data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.user.update({ where: { id: req.params.id }, data: { isDeleted: true } });
    res.json({ success: true, message: "User deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
