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
        const { name, code, description, credits, classId } = req.body;
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        if (typeof code !== "string" || !code.trim()) {
            return res.status(400).json({ success: false, message: "Code is required" });
        }
        if (classId) {
            const cls = await prisma_1.default.class.findFirst({ where: { id: classId } });
            if (!cls) {
                return res.status(400).json({ success: false, message: "Invalid classId" });
            }
        }
        const existing = await prisma_1.default.subject.findFirst({ where: { code: code.trim() } });
        if (existing) {
            return res.status(409).json({ success: false, message: "A subject with this code already exists" });
        }
        const subject = await prisma_1.default.subject.create({
            data: {
                name: name.trim(),
                code: code.trim(),
                description: typeof description === "string" ? description : undefined,
                credits: typeof credits === "number" ? credits : undefined,
                classId: classId ? classId : undefined,
            },
        });
        res.status(201).json({ success: true, message: "Subject created successfully", data: subject });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating subject",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/", async (_req, res) => {
    try {
        const subjects = await prisma_1.default.subject.findMany({
            where: { isDeleted: false },
            include: { class: true, assignments: { where: { isDeleted: false }, select: { id: true, title: true, status: true } } },
        });
        res.status(200).json({ success: true, message: "Subjects fetched successfully", data: subjects });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching subjects",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const subject = await prisma_1.default.subject.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: { class: true, assignments: { where: { isDeleted: false }, select: { id: true, title: true, status: true } } },
        });
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        res.status(200).json({ success: true, message: "Subject fetched successfully", data: subject });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching subject",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { name, code, description, credits, classId } = req.body;
        const existing = await prisma_1.default.subject.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        const data = {};
        if (typeof name === "string" && name.trim())
            data.name = name.trim();
        if (typeof code === "string" && code.trim())
            data.code = code.trim();
        if (typeof description === "string")
            data.description = description;
        if (typeof credits === "number")
            data.credits = credits;
        if (classId !== undefined)
            data.classId = classId === "" ? null : classId;
        const subject = await prisma_1.default.subject.update({ where: { id: req.params.id }, data });
        res.status(200).json({ success: true, message: "Subject updated successfully", data: subject });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating subject",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const existing = await prisma_1.default.subject.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        await prisma_1.default.subject.update({ where: { id: req.params.id }, data: { isDeleted: true } });
        res.status(200).json({ success: true, message: "Subject deleted successfully", data: null });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting subject",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
exports.default = router;
