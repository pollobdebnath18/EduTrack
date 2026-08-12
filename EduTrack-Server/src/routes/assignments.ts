import express from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middlewares/auth";

const router = express.Router();
router.use(authenticate);

router.post("/", async (req, res) => {
  try {
    const { title, description, subjectId, startDate, deadline, maxMarks, status } = req.body;
    const assignment = await prisma.assignment.create({
      data: { title, description, subjectId, startDate, deadline, maxMarks, status }
    });
    res.status(201).json({ success: true, message: "Assignment created", data: assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { isDeleted: false },
      include: { subject: true }
    });
    res.json({ success: true, data: assignments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const assignment = await prisma.assignment.findFirst({
      where: { id: req.params.id, isDeleted: false },
      include: { subject: true }
    });
    if (!assignment) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { title, description, subjectId, startDate, deadline, maxMarks, status } = req.body;
    const assignment = await prisma.assignment.update({
      where: { id: req.params.id },
      data: { title, description, subjectId, startDate, deadline, maxMarks, status }
    });
    res.json({ success: true, message: "Assignment updated", data: assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.assignment.update({ where: { id: req.params.id }, data: { isDeleted: true } });
    res.json({ success: true, message: "Assignment deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
