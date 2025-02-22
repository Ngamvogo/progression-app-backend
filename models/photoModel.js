import supabase from "../config/db.js";

// 📌 Vérifier si l'utilisateur est bien le créateur de la tâche
export async function isTaskOwner(userId, taskId) {
    const { data, error } = await supabase
        .from("tasks")
        .select("user_id")
        .eq("id", taskId)
        .single();

    if (error || !data) {
        console.error("❌ Erreur lors de la vérification du propriétaire de la tâche :", error?.message);
        return false;
    }

    return data.user_id === userId;
}

// 📌 Ajouter une photo en base de données
export async function addPhoto(userId, taskId, photoUrl) {
    const { data, error } = await supabase
        .from("photos")
        .insert([{ task_id: taskId, photo_url: photoUrl, user_id: userId }])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// 📌 Récupérer les photos d'une tâche
export async function getPhotosByTask(taskId) {
    const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("task_id", taskId);

    if (error) {
        console.error("❌ Erreur Supabase :", error);
        throw new Error(error.message);
    }
    console.log("✅ Photos récupérées :", data);
    return data;
}

// 📌 Supprimer une photo en base de données
export async function deletePhoto(photoId) {
    const { data, error } = await supabase
        .from("photos")
        .delete()
        .eq("id", photoId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}