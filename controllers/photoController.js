
import { addPhoto, getPhotosByTask, deletePhoto } from "../models/photoModel.js";
import supabase from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import Jimp from 'jimp-compact';


export async function uploadPhoto(req, res) {
    try {
        console.log("📸 Début de l'upload photo...");
        console.log("📥 Requête reçue : ", req.body);

        const { user_id: userId, task_id: taskId } = req.body;
        const photoFile = req.file;

        console.log("🔍 userId :", userId, "| taskId :", taskId);

        if (!photoFile) {
            return res.status(400).json({ error: "Aucune image envoyée" });
        }

        // Charger et convertir l'image en PNG
        const image = await Jimp.read(photoFile.buffer);
        const imageName = `${uuidv4()}.png`;
        const tempPath = path.join("/tmp", imageName);
        await image.writeAsync(tempPath);

        // 📌 Upload de l'image sur Supabase
        const { data, error } = await supabase.storage
            .from("photos")
            .upload(imageName, await fs.readFile(tempPath), {
                contentType: "image/png",
            });

        await fs.unlink(tempPath); // Supprimer l'image temporaire

        if (error) {
            throw new Error("Erreur lors de l'upload de l'image : " + error.message);
        }

        // 📡 Vérification de la réponse de getPublicUrl
        const publicUrlResponse = supabase.storage.from("photos").getPublicUrl(imageName);
        console.log("📡 Réponse de getPublicUrl:", publicUrlResponse);

        // ✅ Extraction correcte de l'URL
        const imageUrl = publicUrlResponse.data.publicUrl || null;

        if (!imageUrl) {
            throw new Error("L'URL publique de l'image est introuvable.");
        }

        console.log("✅ Image uploadée avec succès:", imageUrl);

        // 📌 Sauvegarde des informations en base de données
        const photo = await addPhoto(userId, taskId, imageUrl);

        console.log("✅ Photo enregistrée en base:", photo);

        res.status(201).json(photo);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout de la photo:", error.message);
        res.status(500).json({
            error: "Erreur lors de l'ajout de la photo",
            details: error.message,
        });
    }
}


// 📌 Récupérer les photos d'une tâche
export async function getTaskPhotos(req, res) {
    try {
        console.log("📸 Récupération des photos...");
        
        const { taskId } = req.params;
        console.log("🔍 taskId :", taskId);

        if (!taskId) {
            return res.status(400).json({ error: "L'ID de la tâche est requis" });
        }

        // 📌 Récupérer les photos associées à la tâche
        const photos = await getPhotosByTask(taskId);

        if (!photos || photos.length === 0) {
            return res.status(404).json({ error: "Aucune photo trouvée pour cette tâche" });
        }

        // Trier les photos par date de création (de la première à la dernière)
        photos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        console.log("✅ Photos récupérées et triées :", photos);

        res.status(200).json(photos);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des photos :", error.message);
        res.status(500).json({
            error: "Erreur lors de la récupération des photos",
            details: error.message,
        });
    }
}


// 📌 Supprimer une photo
export async function removePhoto(req, res) {
    try {
        const { photoId } = req.params;

        // 📌 Récupérer l'URL de l'image avant suppression
        const photo = await deletePhoto(photoId);
        if (!photo) {
            return res.status(404).json({ error: "Photo non trouvée" });
        }

        // 📌 Extraire le nom du fichier et le supprimer de Supabase
        const fileName = photo.photo_url.split("/").pop();
        await supabase.storage.from("photos").remove([fileName]);

        res.status(200).json({ message: "Photo supprimée avec succès" });
    } catch (error) {
        res.status(500).json({
            error: "Erreur lors de la suppression de la photo",
            details: error.message,
        });
    }
}
// 📌 Générer une image "avant-après"
export async function generateBeforeAfterImage(req, res) {
    try {
        console.log("📸 Génération de l'image avant-après...");
        
        const { taskId } = req.params;
        console.log("🔍 taskId :", taskId);

        if (!taskId) {
            return res.status(400).json({ error: "L'ID de la tâche est requis" });
        }

        // 📌 Récupérer toutes les photos associées à la tâche
        const photos = await getPhotosByTask(taskId);

        if (!photos || photos.length < 2) {
            return res.status(400).json({
                error: "Pas assez de photos pour comparer",
                details: "Il faut au moins 2 photos pour générer un avant-après.",
            });
        }

        // Trier les photos par date d'ajout
        photos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        // 📸 Sélectionner la première et la dernière photo
        const firstPhotoUrl = photos[0].photo_url;
        const lastPhotoUrl = photos[photos.length - 1].photo_url;

        console.log("✅ Avant :", firstPhotoUrl);
        console.log("✅ Après :", lastPhotoUrl);

        res.status(200).json({ firstPhotoUrl, lastPhotoUrl });
    } catch (error) {
        console.error("❌ Erreur lors de la génération de l'image avant-après :", error.message);
        res.status(500).json({
            error: "Erreur lors de la génération de l'image avant-après",
            details: error.message,
        });
    }
}
