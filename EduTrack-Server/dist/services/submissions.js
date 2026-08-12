"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const VALID_STATUSES = ["Pending", "Submitted", "Graded", "Late"];
router.use(auth_1.authenticate);
router.post("/", async (req, res) => {
    try {
        const { content, fileUrl, status, studentId, assignmentId } = req.body;
        if (typeof studentId !== "string" || !studentId) {
            return res.status(400).json({ success: false, message: "studentId is required" });
        }
        if (typeof assignmentId !== "string" || !assignmentId) {
            return res.status(400).json({ success: false, message: "assignmentId is required" });
        }
        if (!content && !fileUrl) {
            return res.status(400).json({ success: false, message: "content or fileUrl is required" });
        }
        const existing = await prisma_1.default.submission.findFirst({
            where: { studentId, assignmentId, isDeleted: false },
        });
        if (existing) {
            return res.status(409).json({ success: false, message: "A submission for this assignment already exists" });
        }
        const submission = await prisma_1.default.submission.create({
            data: {
                content: typeof content === "string" ? content : undefined,
                fileUrl: typeof fileUrl === "string" ? fileUrl : undefined,
                status: status && VALID_STATUSES.includes(status) ? status : "Pending",
                studentId: studentId,
                assignmentId: assignmentId,
            },
        });
        res.status(201).json({ success: true, message: "Submission created successfully", data: submission });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating submission",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/", async (_req, res) => {
    try {
        const submissions = await prisma_1.default.submission.findMany({
            where: { isDeleted: false },
            include: {
                student: { select: { id: true, name: true, email: true } },
                assignment: { select: { id: true, title: true } },
            },
        });
        res.status(200).json({ success: true, message: "Submissions fetched successfully", data: submissions });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching submissions",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const submission = await prisma_1.default.submission.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: {
                student: { select: { id: true, name: true, email: true } },
                assignment: { select: { id: true, title: true, totalMarks: true } },
                evaluation: true,
            },
        });
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }
        res.status(200).json({ success: true, message: "Submission fetched successfully", data: submission });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching submission",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { content, fileUrl, status } = req.body;
        const existing = await prisma_1.default.submission.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }
        const data = {};
        if (typeof content === "string")
            data.content = content;
        if (typeof fileUrl === "string")
            data.fileUrl = fileUrl;
        if (status && VALID_STATUSES.includes(status))
            data.status = status;
        const submission = await prisma_1.default.submission.update({ where: { id: req.params.id }, data });
        res.status(200).json({ success: true, message: "Submission updated successfully", data: submission });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating submission",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const existing = await prisma_1.default.submission.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }
        await prisma_1.default.submission.update({ where: { id: req.params.id }, data: { isDeleted: true } });
        res.status(200).json({ success: true, message: "Submission deleted successfully", data: null });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting submission",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
exports.default = router;
