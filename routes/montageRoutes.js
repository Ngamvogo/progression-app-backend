import express from "express";
import { generateMontage, getGallery } from "../controllers/montageController.js";

const router = express.Router();

// Route pour générer un montage avant/après
router.get("/montage/:taskId", generateMontage);

// Route pour récupérer la galerie de photos
router.get("/gallery/:taskId", getGallery);

export default router;
