"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwt_1 = require("../lib/jwt");
const router = express_1.default.Router();
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }
        const hashed = await (0, jwt_1.hashPassword)(password);
        const user = await prisma_1.default.user.create({
            data: { name, email, password: hashed }
        });
        const token = (0, jwt_1.signToken)(user.id);
        res.status(201).json({
            success: true,
            message: "User created",
            data: { token, user: { id: user.id, name: user.name, email: user.email } }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || user.isDeleted) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const match = await (0, jwt_1.comparePassword)(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const token = (0, jwt_1.signToken)(user.id);
        res.status(200).json({
            success: true,
            message: "Signed in",
            data: { token, user: { id: user.id, name: user.name, email: user.email } }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
exports.default = router;
