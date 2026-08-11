import { Router } from "express";
import teachers from "../services/teachers";

const router = Router();

router.use("/teachers", teachers);

export default router;
