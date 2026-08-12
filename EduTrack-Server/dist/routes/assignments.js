"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.post("/", async (req, res) => {
    try {
        const { title, description, subjectId, startDate, deadline, maxMarks, status } = req.body;
        const assignment = await prisma_1.default.assignment.create({
            data: { title, description, subjectId, startDate, deadline, maxMarks, status }
        });
        res.status(201).json({ success: true, message: "Assignment created", data: assignment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.get("/", async (req, res) => {
    try {
        const assignments = await prisma_1.default.assignment.findMany({
            where: { isDeleted: false },
            include: { subject: true }
        });
        res.json({ success: true, data: assignments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const assignment = await prisma_1.default.assignment.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: { subject: true }
        });
        if (!assignment)
            return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: assignment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { title, description, subjectId, startDate, deadline, maxMarks, status } = req.body;
        const assignment = await prisma_1.default.assignment.update({
            where: { id: req.params.id },
            data: { title, description, subjectId, startDate, deadline, maxMarks, status }
        });
        res.json({ success: true, message: "Assignment updated", data: assignment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.default.assignment.update({ where: { id: req.params.id }, data: { isDeleted: true } });
        res.json({ success: true, message: "Assignment deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
exports.default = router;
