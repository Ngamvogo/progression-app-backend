import express from "express";
import { uploadMiddleware, uploadPhoto, getTaskPhotos, removePhoto, generateBeforeAfter } from "../controllers/photoController.js";

const router = express.Router();

router.post("/upload", uploadMiddleware, uploadPhoto);  // Ajout de Multer comme middleware
router.get("/task/:taskId", getTaskPhotos);
router.delete("/:photoId", removePhoto);
router.get("/before-after/:taskId", generateBeforeAfter);

export default router;
