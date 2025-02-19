import express from "express";
import { addTask, listTasks, modifyTask, removeTask} from "../controllers/taskController.js";

const router = express.Router();

router.post("/tasks", addTask);        // Créer une tâche
router.get("/tasks/:userId", listTasks); // Voir les tâches d'un utilisateur
router.put("/tasks/:taskId", modifyTask); // Mettre à jour une tâche
router.delete("/tasks/:taskId", removeTask); // Supprimer une tâche
export default router;
