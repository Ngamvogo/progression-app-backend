import { createUser, getUserByEmail } from "../models/userModel.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await createUser(name, email, password);
    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
