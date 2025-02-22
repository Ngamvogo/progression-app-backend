import express from "express";
import { validateDay,getProgress } from "../controllers/progressController.js";

const router = express.Router();

router.get("/progress/:taskId", getProgress);
router.post("/validate/:taskId", validateDay);

export default router;