import { createTask, getTasks, updateTask, deleteTask } from "../models/taskModel.js";

export const addTask = async (req, res) => {
  const { userId, title, duration, description } = req.body;

  try {
    const task = await createTask(userId, title, duration, description);
    res.status(201).json({ message: "Tâche créée", task });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la tâche", details: error.message });
  }
};

export const listTasks = async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await getTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des tâches", details: error.message });
  }
};

export const modifyTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  try {
    const task = await updateTask(taskId, updates);
    res.status(200).json({ message: "Tâche mise à jour", task });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour", details: error.message });
  }
};

export const removeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    await deleteTask(taskId);
    res.status(200).json({ message: "Tâche supprimée" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression", details: error.message });
  }
};


