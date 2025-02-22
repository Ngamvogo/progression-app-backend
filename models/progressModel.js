// progressModel.js
import supabase from "../config/db.js";

// 📌 Valider une journée d'une tâche
export async function validateTaskDay(userId, taskId, dayNumber) {
    const { data, error } = await supabase
        .from("progress")
        .insert([{ task_id: taskId, user_id: userId, day_number: dayNumber }])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// 📌 Récupérer la progression d'une tâche
export async function getTaskProgress(taskId) {
    const { data, error } = await supabase
        .from("progress")
        .select("day_number")
        .eq("task_id", taskId);

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// 📌 Récupérer la durée totale d'une tâche
export async function getTaskDuration(taskId) {
    const { data, error } = await supabase
        .from("tasks")
        .select("duration")
        .eq("id", taskId)
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data.duration;
}