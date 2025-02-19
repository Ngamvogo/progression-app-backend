import express from "express";
import { uploadPhoto } from "../controllers/photoController.js";

const router = express.Router();

router.post("/upload", uploadPhoto);

export default router;
