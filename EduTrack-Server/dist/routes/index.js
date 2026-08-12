"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const subjects_1 = __importDefault(require("./subjects"));
const assignments_1 = __importDefault(require("./assignments"));
const submissions_1 = __importDefault(require("./submissions"));
const router = express_1.default.Router();
router.use("/auth", auth_1.default);
router.use("/users", users_1.default);
router.use("/subjects", subjects_1.default);
router.use("/assignments", assignments_1.default);
router.use("/submissions", submissions_1.default);
exports.default = router;
