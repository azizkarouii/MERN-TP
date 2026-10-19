
const express = require("express");
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3000;
const articleRoutes = require ('./routes/articleRoutes') ;
const userRoutes = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Chargement des variables d’environnement (.env)
dotenv.config();

// Middleware pour parser le corps des requetes en JSON
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

(async () => {
    try {
        // 1. Établissement de la connexion distante
        await connectDB(process.env.MONGODB_URI);

        // 2. Démarrage de l'écoute du serveur HTTP
        app.listen(PORT, () => {
            console.log(`Serveur MERN en écoute sur http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error(
            'Erreur critique de démarrage du serveur :',
            err.message
        );

        process.exit(1);
    }
})();

// 1. Protection des routes privées : vérifie la validité du JWT
const protect = async (req, res, next) => {
    let token;

    // Vérification de la présence de l'en-tête Authorization avec Bearer
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        try {
            // Extraction du token (après "Bearer")
            token = req.headers.authorization.split(' ')[1];

            // Vérification cryptographique de la signature avec le secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Récupération de l'utilisateur associé (exclusion du mot de passe)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    message: 'Non autorisé, utilisateur introuvable'
                });
            }

            // Passage au middleware ou contrôleur suivant
            return next();

        } catch (err) {
            return res.status(401).json({
                message: 'Non autorisé, token invalide ou expiré'
            });
        }
    }

    // Si aucun en-tête Authorization n'est fourni
    return res.status(401).json({
        message: 'Non autorisé, aucun token fourni'
    });
};

// 2. Contrôle d'accès basé sur les rôles (RBAC) : réservé aux admins
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        message: 'Accès refusé : droits administrateur requis'
    });
};


module.exports = { protect, adminOnly };

