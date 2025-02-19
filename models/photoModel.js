import supabase from "../config/db.js";

export async function addPhoto(user_id, task_id, photo_url) {
    const { data, error } = await supabase
        .from("photos")
        .insert([{ user_id, task_id, photo_url }])
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function getPhotosByTask(taskId) {
    const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("task_id", taskId);

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function deletePhoto(photoId) {
    const { data, error } = await supabase
        .from("photos")
        .delete()
        .eq("id", photoId);

    if (error) {
        throw new Error(error.message);
    }
    return data;
}
