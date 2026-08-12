"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../lib/jwt");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Provide a valid Bearer token",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = { userId: payload.userId };
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
exports.authenticate = authenticate;
