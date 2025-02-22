import { getPhotosByTask } from "../models/photoModel.js";
import Jimp from "jimp-compact";

/**
 * Générer un montage avant/après à la fin de la période
 */
export async function generateMontage(req, res) {
    try {
        const { taskId } = req.params;

        // Récupérer toutes les photos de la tâche
        const photos = await getPhotosByTask(taskId);
        if (!photos || photos.length < 2) {
            return res.status(400).json({ error: "Pas assez de photos pour un montage" });
        }

        // Trier les photos par date
        photos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        // Charger la première et la dernière image
        const firstPhoto = await Jimp.read(photos[0].photo_url);
        const lastPhoto = await Jimp.read(photos[photos.length - 1].photo_url);

        // Fusionner les deux images côte à côte
        const montageWidth = firstPhoto.getWidth() + lastPhoto.getWidth();
        const montageHeight = Math.max(firstPhoto.getHeight(), lastPhoto.getHeight());
        const montage = new Jimp(montageWidth, montageHeight);

        montage.composite(firstPhoto, 0, 0);
        montage.composite(lastPhoto, firstPhoto.getWidth(), 0);

        // Sauvegarder le montage temporairement
        const montagePath = `/tmp/montage-${taskId}.png`;
        await montage.writeAsync(montagePath);

        res.status(200).json({ message: "Montage généré avec succès", montagePath });
    } catch (error) {
        console.error("❌ Erreur lors de la génération du montage :", error.message);
        res.status(500).json({ error: "Erreur lors de la génération du montage", details: error.message });
    }
}

/**
 * Récupérer la galerie de toutes les photos d'une tâche
 */
export async function getGallery(req, res) {
    try {
        const { taskId } = req.params;

        // Récupérer toutes les photos associées à la tâche
        const photos = await getPhotosByTask(taskId);

        if (!photos || photos.length === 0) {
            return res.status(404).json({ error: "Aucune photo trouvée pour cette tâche" });
        }

        // Trier les photos dans l'ordre chronologique
        photos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        res.status(200).json({ photos });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la galerie :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération de la galerie", details: error.message });
    }
}
