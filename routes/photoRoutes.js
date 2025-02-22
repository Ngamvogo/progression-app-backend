import express from 'express';
import { uploadPhoto, getTaskPhotos, removePhoto, generateBeforeAfterImage  } from '../controllers/photoController.js';
import multer from 'multer';

const router = express.Router();

// Configuration de multer pour gérer les uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route pour uploader une photo
router.post('/upload', upload.single('photo'), uploadPhoto);
router.get("/task/:taskId", getTaskPhotos);
router.delete("/:photoId", removePhoto);


// Route pour générer une image avant-après
router.get('/task/:taskId/before-after', generateBeforeAfterImage);

export default router;

