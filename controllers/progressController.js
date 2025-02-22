// progressController.js
import { validateTaskDay, getTaskProgress, getTaskDuration } from "../models/progressModel.js";

// 📌 Valider un jour d'une tâche
export async function validateDay(req, res) {
    try {
        const { user_id: userId, task_id: taskId, day_number: dayNumber } = req.body;

        if (!userId || !taskId || !dayNumber) {
            return res.status(400).json({ error: "Informations manquantes" });
        }

        const progress = await validateTaskDay(userId, taskId, dayNumber);
        res.status(201).json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 📌 Récupérer la progression d'une tâche
export async function getProgress(req, res) {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(400).json({ error: "L'ID de la tâche est requis" });
        }

        const progressData = await getTaskProgress(taskId);
        const taskDuration = await getTaskDuration(taskId);
        const progressCount = progressData.length;

        const progressPercentage = Math.round((progressCount / taskDuration) * 100);
        res.status(200).json({ progress: progressPercentage, completed_days: progressCount, total_days: taskDuration });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

