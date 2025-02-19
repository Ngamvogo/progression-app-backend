import { addPhoto, getPhotosByTask, deletePhoto } from "../models/photoModel.js";

// Ajouter une photo
export async function uploadPhoto(req, res) {
    const { userId, taskId, photoUrl } = req.body;

    try {
        const photo = await addPhoto(userId, taskId, photoUrl);
        res.status(201).json(photo);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout de la photo", details: error.message });
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
