import express from "express";
import authRoutes from "./auth";
import userRoutes from "./users";
import subjectRoutes from "./subjects";
import assignmentRoutes from "./assignments";
import submissionRoutes from "./submissions";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/subjects", subjectRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/submissions", submissionRoutes);

export default router;