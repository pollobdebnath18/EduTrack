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
router.get("/", async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({ where: { isDeleted: false }, select: { id: true, name: true, email: true, createdAt: true } });
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const user = await prisma_1.default.user.findFirst({ where: { id: req.params.id, isDeleted: false }, select: { id: true, name: true, email: true, createdAt: true } });
        if (!user)
            return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await prisma_1.default.user.update({
            where: { id: req.params.id },
            data: { name, email },
            select: { id: true, name: true, email: true }
        });
        res.json({ success: true, message: "User updated", data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.default.user.update({ where: { id: req.params.id }, data: { isDeleted: true } });
        res.json({ success: true, message: "User deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
exports.default = router;
