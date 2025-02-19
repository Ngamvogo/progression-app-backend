const mongoose = require('mongoose');

const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/test";

mongoose.connect(uri)
    .then(() => console.log("✅ Connexion réussie à MongoDB Atlas"))
    .catch((err) => console.error("❌ Erreur de connexion MongoDB:", err));