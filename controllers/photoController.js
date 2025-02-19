import { addPhoto, getPhotosByTask, deletePhoto } from "../models/photoModel.js";
import sharp from "sharp";
import multer from "multer";
import path from "path";
import fs from "fs";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware pour gérer l'upload du fichier
export const uploadMiddleware = upload.single("photo");

// Ajouter une photo
export async function uploadPhoto(req, res) {
    const { task_id } = req.body;
    const userId = req.body.user_id; // Assure-toi que Postman envoie bien cet ID

    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier n'a été téléchargé." });
        }

        // Convertir l'image en base64 pour la stocker dans Supabase (ou utiliser Supabase Storage)
        const photoBuffer = req.file.buffer;
        const photoBase64 = photoBuffer.toString("base64");

        // Stocker l'image dans Supabase (tu peux aussi utiliser Supabase Storage pour un vrai fichier)
        const photo = await addPhoto(userId, task_id, photoBase64);

        res.status(201).json(photo);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout de la photo", details: error.message });
    }
}
// Générer une image avant/après
export async function generateBeforeAfter(req, res) {
    const { taskId } = req.params;

    try {
        const photos = await getPhotosByTask(taskId);
        if (photos.length < 2) {
            return res.status(400).json({ error: "Il faut au moins deux photos pour générer l'image." });
        }

        const firstPhotoUrl = photos[0].photo_url;
        const lastPhotoUrl = photos[photos.length - 1].photo_url;
        
        const outputFilePath = path.join("uploads", `before_after_${taskId}.jpg`);
        
        await sharp(firstPhotoUrl)
            .resize(500)
            .composite([{ input: await sharp(lastPhotoUrl).resize(500).toBuffer(), left: 500, top: 0 }])
            .toFile(outputFilePath);

        res.status(200).json({ message: "Image générée", url: `/uploads/before_after_${taskId}.jpg` });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la génération de l'image", details: error.message });
    }
}

// Récupérer les photos d'une tâche
export async function getTaskPhotos(req, res) {
    const { taskId } = req.params;

    try {
        const photos = await getPhotosByTask(taskId);
        res.status(200).json(photos);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des photos", details: error.message });
    }
}



// Supprimer une photo
export async function removePhoto(req, res) {
    const { photoId } = req.params;

    try {
        await deletePhoto(photoId);
        res.status(200).json({ message: "Photo supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de la photo", details: error.message });
    }
}
