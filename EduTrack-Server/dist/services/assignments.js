"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const VALID_STATUSES = ["Draft", "Published", "Closed"];
router.use(auth_1.authenticate);
router.post("/", async (req, res) => {
    try {
        const { title, description, dueDate, totalMarks, status, teacherId, classId, subjectId } = req.body;
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }
        if (typeof teacherId !== "string" || !teacherId) {
            return res.status(400).json({ success: false, message: "teacherId is required" });
        }
        if (typeof classId !== "string" || !classId) {
            return res.status(400).json({ success: false, message: "classId is required" });
        }
        if (typeof subjectId !== "string" || !subjectId) {
            return res.status(400).json({ success: false, message: "subjectId is required" });
        }
        const assignment = await prisma_1.default.assignment.create({
            data: {
                title: title.trim(),
                description: typeof description === "string" ? description : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                totalMarks: typeof totalMarks === "number" ? totalMarks : 100,
                status: status && VALID_STATUSES.includes(status) ? status : "Draft",
                teacherId: teacherId,
                classId: classId,
                subjectId: subjectId,
            },
        });
        res.status(201).json({ success: true, message: "Assignment created successfully", data: assignment });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating assignment",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/", async (_req, res) => {
    try {
        const assignments = await prisma_1.default.assignment.findMany({
            where: { isDeleted: false },
            include: {
                teacher: { select: { id: true, name: true, email: true } },
                class: true,
                subject: true,
                _count: { select: { submissions: true } },
            },
        });
        res.status(200).json({ success: true, message: "Assignments fetched successfully", data: assignments });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching assignments",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const assignment = await prisma_1.default.assignment.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: {
                teacher: { select: { id: true, name: true, email: true } },
                class: true,
                subject: true,
                submissions: { where: { isDeleted: false } },
            },
        });
        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }
        res.status(200).json({ success: true, message: "Assignment fetched successfully", data: assignment });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching assignment",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { title, description, dueDate, totalMarks, status } = req.body;
        const existing = await prisma_1.default.assignment.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }
        const data = {};
        if (typeof title === "string" && title.trim())
            data.title = title.trim();
        if (typeof description === "string")
            data.description = description;
        if (dueDate)
            data.dueDate = new Date(dueDate);
        if (typeof totalMarks === "number")
            data.totalMarks = totalMarks;
        if (status && VALID_STATUSES.includes(status))
            data.status = status;
        const assignment = await prisma_1.default.assignment.update({ where: { id: req.params.id }, data });
        res.status(200).json({ success: true, message: "Assignment updated successfully", data: assignment });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating assignment",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const existing = await prisma_1.default.assignment.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }
        await prisma_1.default.assignment.update({ where: { id: req.params.id }, data: { isDeleted: true } });
        res.status(200).json({ success: true, message: "Assignment deleted successfully", data: null });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting assignment",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
exports.default = router;
