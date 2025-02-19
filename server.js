import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());



app.use(express.json());
app.use("/users", userRoutes);
app.use("/api", taskRoutes);
app.use("/api/photos", photoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
