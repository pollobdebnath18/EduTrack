"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwt_1 = require("../lib/jwt");
const router = (0, express_1.Router)();
const VALID_ROLES = ["Admin", "Student", "Teacher"];
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        if (typeof email !== "string" || !email.trim() || !isValidEmail(email.trim())) {
            return res.status(400).json({ success: false, message: "A valid email is required" });
        }
        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }
        const roleValue = role && VALID_ROLES.includes(role) ? role : "Student";
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await prisma_1.default.user.findFirst({ where: { email: normalizedEmail } });
        if (existing) {
            return res.status(409).json({ success: false, message: "An account with this email already exists" });
        }
        const hashedPassword = await (0, jwt_1.hashPassword)(password);
        const user = await prisma_1.default.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: roleValue,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        const token = (0, jwt_1.signToken)(user.id);
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: { token, user },
        });
    }
    catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            success: false,
            message: "Error creating account",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (typeof password !== "string" || !password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = await prisma_1.default.user.findFirst({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const isPasswordValid = await (0, jwt_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const token = (0, jwt_1.signToken)(user.id);
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (err) {
        console.error("Signin Error:", err);
        res.status(500).json({
            success: false,
            message: "Error signing in",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
exports.default = router;
