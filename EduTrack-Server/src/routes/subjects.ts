import express from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middlewares/auth";

const router = express.Router();
router.use(authenticate);

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const subject = await prisma.subject.create({ data: { name, description } });
    res.status(201).json({ success: true, message: "Subject created", data: subject });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({ where: { isDeleted: false } });
    res.json({ success: true, data: subjects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const subject = await prisma.subject.findFirst({ where: { id: req.params.id, isDeleted: false } });
    if (!subject) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: subject });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const subject = await prisma.subject.update({
      where: { id: req.params.id },
      data: { name, description }
    });
    res.json({ success: true, message: "Subject updated", data: subject });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.subject.update({ where: { id: req.params.id }, data: { isDeleted: true } });
    res.json({ success: true, message: "Subject deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
