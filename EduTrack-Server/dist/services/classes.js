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
        const { name, code, description, startDate, endDate } = req.body;
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        if (typeof code !== "string" || !code.trim()) {
            return res.status(400).json({ success: false, message: "Code is required" });
        }
        const existing = await prisma_1.default.class.findFirst({ where: { code: code.trim() } });
        if (existing) {
            return res.status(409).json({ success: false, message: "A class with this code already exists" });
        }
        const cls = await prisma_1.default.class.create({
            data: {
                name: name.trim(),
                code: code.trim(),
                description: typeof description === "string" ? description : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            },
        });
        res.status(201).json({ success: true, message: "Class created successfully", data: cls });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating class",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/", async (_req, res) => {
    try {
        const classes = await prisma_1.default.class.findMany({
            where: { isDeleted: false },
            include: {
                subjects: { where: { isDeleted: false } },
                assignments: { where: { isDeleted: false }, select: { id: true, title: true, status: true } },
            },
        });
        res.status(200).json({ success: true, message: "Classes fetched successfully", data: classes });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching classes",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const cls = await prisma_1.default.class.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: {
                subjects: { where: { isDeleted: false } },
                assignments: { where: { isDeleted: false }, select: { id: true, title: true, status: true } },
            },
        });
        if (!cls) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        res.status(200).json({ success: true, message: "Class fetched successfully", data: cls });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching class",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { name, code, description, startDate, endDate } = req.body;
        const existing = await prisma_1.default.class.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        const data = {};
        if (typeof name === "string" && name.trim())
            data.name = name.trim();
        if (typeof code === "string" && code.trim())
            data.code = code.trim();
        if (typeof description === "string")
            data.description = description;
        if (startDate)
            data.startDate = new Date(startDate);
        if (endDate)
            data.endDate = new Date(endDate);
        const cls = await prisma_1.default.class.update({ where: { id: req.params.id }, data });
        res.status(200).json({ success: true, message: "Class updated successfully", data: cls });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating class",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const existing = await prisma_1.default.class.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        await prisma_1.default.class.update({ where: { id: req.params.id }, data: { isDeleted: true } });
        res.status(200).json({ success: true, message: "Class deleted successfully", data: null });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting class",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
exports.default = router;
