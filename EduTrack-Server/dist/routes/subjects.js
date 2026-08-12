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
        const { name, description } = req.body;
        const subject = await prisma_1.default.subject.create({ data: { name, description } });
        res.status(201).json({ success: true, message: "Subject created", data: subject });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.get("/", async (req, res) => {
    try {
        const subjects = await prisma_1.default.subject.findMany({ where: { isDeleted: false } });
        res.json({ success: true, data: subjects });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const subject = await prisma_1.default.subject.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!subject)
            return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: subject });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { name, description } = req.body;
        const subject = await prisma_1.default.subject.update({
            where: { id: req.params.id },
            data: { name, description }
        });
        res.json({ success: true, message: "Subject updated", data: subject });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.default.subject.update({ where: { id: req.params.id }, data: { isDeleted: true } });
        res.json({ success: true, message: "Subject deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
exports.default = router;
