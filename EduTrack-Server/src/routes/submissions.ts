import express from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middlewares/auth";

const router = express.Router();
router.use(authenticate);

router.post("/", async (req, res) => {
  try {
    const { assignmentId, answer } = req.body;
    // user ID comes from auth middleware
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    let submission = await prisma.submission.findFirst({
      where: { userId, assignmentId }
    });

    if (submission) {
      submission = await prisma.submission.update({
        where: { id: submission.id },
        data: { answer, status: "Submitted", submittedAt: new Date() }
      });
    } else {
      submission = await prisma.submission.create({
        data: { userId, assignmentId, answer, status: "Submitted" }
      });
    }

    res.status(201).json({ success: true, message: "Submission successful", data: submission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    // If we only want the logged-in user's submissions
    const userId = req.user?.userId;
    const submissions = await prisma.submission.findMany({
      where: { isDeleted: false, userId },
      include: { assignment: true }
    });
    res.json({ success: true, data: submissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const submission = await prisma.submission.findFirst({
      where: { id: req.params.id, isDeleted: false },
      include: { assignment: true }
    });
    if (!submission) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: submission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    // Both user can update answer, or "teacher" can grade. 
    // Since there's no role, we just allow updating fields loosely.
    const { answer, marks, feedback, status } = req.body;
    const dataToUpdate: any = { answer, marks, feedback, status };
    if (answer) dataToUpdate.submittedAt = new Date();

    const submission = await prisma.submission.update({
      where: { id: req.params.id },
      data: dataToUpdate
    });
    res.json({ success: true, message: "Submission updated", data: submission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.submission.update({ where: { id: req.params.id }, data: { isDeleted: true } });
    res.json({ success: true, message: "Submission deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
