import supabase from "../config/db.js";

// 📌 Ajouter une photo en base de données
export async function addPhoto(userId, taskId, photoUrl) {
    const { data, error } = await supabase
        .from("photos")
        .insert([{ task_id: taskId, photo_url: photoUrl,user_id: userId, },])
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
    console.log("✅ Photo ajoutée :", data);
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

