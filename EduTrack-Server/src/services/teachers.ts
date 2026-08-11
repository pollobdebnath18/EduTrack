import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { title, description, subject, startDate, endDate, marks } = req.body;

    const teacher = await prisma.teacher.create({
      data: {
        title,
        description,
        subject,
        startDate,
        endDate,
        marks,
      },
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (err) {
    console.log("Prisma Error:", err);

    res.status(500).json({
      success: false,
      message: "Error creating teacher",
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

export default router;
