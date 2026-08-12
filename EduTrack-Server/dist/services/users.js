"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwt_1 = require("../lib/jwt");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const SELECT_SAFE = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
};
const VALID_ROLES = ["Admin", "Student", "Teacher"];
router.use(auth_1.authenticate);
router.post("/", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }
        const roleValue = role && VALID_ROLES.includes(role) ? role : "Student";
        const existing = await prisma_1.default.user.findFirst({ where: { email: email.trim().toLowerCase() } });
        if (existing) {
            return res.status(409).json({ success: false, message: "An account with this email already exists" });
        }
        const user = await prisma_1.default.user.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: await (0, jwt_1.hashPassword)(password),
                role: roleValue,
            },
            select: SELECT_SAFE,
        });
        res.status(201).json({ success: true, message: "User created successfully", data: user });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/", async (_req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({ where: { isDeleted: false }, select: SELECT_SAFE });
        res.status(200).json({ success: true, message: "Users fetched successfully", data: users });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const user = await prisma_1.default.user.findFirst({
            where: { id: req.params.id, isDeleted: false },
            select: SELECT_SAFE,
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User fetched successfully", data: user });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { name, email, role, password } = req.body;
        const existing = await prisma_1.default.user.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const data = {};
        if (typeof name === "string" && name.trim())
            data.name = name.trim();
        if (typeof email === "string" && email.trim())
            data.email = email.trim().toLowerCase();
        if (role && VALID_ROLES.includes(role))
            data.role = role;
        if (typeof password === "string" && password.length >= 6)
            data.password = await (0, jwt_1.hashPassword)(password);
        const user = await prisma_1.default.user.update({
            where: { id: req.params.id },
            data,
            select: SELECT_SAFE,
        });
        res.status(200).json({ success: true, message: "User updated successfully", data: user });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating user",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const existing = await prisma_1.default.user.findFirst({ where: { id: req.params.id, isDeleted: false } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await prisma_1.default.user.update({ where: { id: req.params.id }, data: { isDeleted: true } });
        res.status(200).json({ success: true, message: "User deleted successfully", data: null });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
exports.default = router;
