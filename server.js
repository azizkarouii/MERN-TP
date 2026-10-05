
const express = require("express");
const app = express();
const PORT = 3000;
const articleRoutes = require ('./routes/articleRoutes') ;
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Bonjour, je suis l'API du blog - Serveur Modulaire Opérationnel (SoC)"
    });
});




app.get("/about", (req, res) => {
    res.json({
        application: "API du blog",
        nom: "Mohamed Aziz Karoui",
        version: "1.0.0"
    });
});

app.post("/contact", (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({
            error: "L'email et le message sont obligatoires"
        });
    }

    res.status(200).json({
        message: "Merci, votre message a bien été reçu"
    });
});

app.listen(PORT, () => {
    console.log(`Serveur disponible sur http://localhost:${PORT}`);
});

