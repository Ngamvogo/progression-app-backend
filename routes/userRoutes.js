import express from "express";
import { registerUser, getUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/:email", getUser);

export default router;

