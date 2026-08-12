"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post("/", async (req, res) => {
    try {
        const { title, description, subject, startDate, endDate, marks } = req.body;
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }
        if (typeof subject !== "string" || !subject.trim()) {
            return res.status(400).json({ success: false, message: "Subject is required" });
        }
        const teacher = await prisma_1.default.teacher.create({
            data: {
                title: title.trim(),
                description: typeof description === "string" ? description : "",
                subject: subject.trim(),
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : new Date(),
                marks: typeof marks === "number" ? marks : 0,
            },
        });
        res.status(201).json({ success: true, message: "Teacher created successfully", data: teacher });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating teacher",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/", async (_req, res) => {
    try {
        const teachers = await prisma_1.default.teacher.findMany({ where: { isDeleted: false } });
        res.status(200).json({ success: true, message: "Teachers fetched successfully", data: teachers });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching teachers",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const teacher = await prisma_1.default.teacher.findFirst({
            where: { id: req.params.id, isDeleted: false },
        });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        res.status(200).json({ success: true, message: "Teacher fetched successfully", data: teacher });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching teacher",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { title, description, subject, startDate, endDate, marks } = req.body;
        const existing = await prisma_1.default.teacher.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        const data = {};
        if (typeof title === "string" && title.trim())
            data.title = title.trim();
        if (typeof description === "string")
            data.description = description;
        if (typeof subject === "string" && subject.trim())
            data.subject = subject.trim();
        if (startDate)
            data.startDate = new Date(startDate);
        if (endDate)
            data.endDate = new Date(endDate);
        if (typeof marks === "number")
            data.marks = marks;
        const teacher = await prisma_1.default.teacher.update({ where: { id: req.params.id }, data });
        res.status(200).json({ success: true, message: "Teacher updated successfully", data: teacher });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating teacher",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const existing = await prisma_1.default.teacher.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        await prisma_1.default.teacher.update({ where: { id: req.params.id }, data: { isDeleted: true } });
        res.status(200).json({ success: true, message: "Teacher deleted successfully", data: null });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting teacher",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
exports.default = router;
