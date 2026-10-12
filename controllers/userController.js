const User = require('../models/userModel');

// 1. Obtenir tous les utilisateurs (GET /api/users)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Obtenir un utilisateur par son ID (GET /api/users/:id)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Créer un nouvel utilisateur (POST /api/users)
const createUser = async (req, res) => {
    try {
        const { name, email, age, role } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Le nom et l'email sont requis"
            });
        }

        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(409).json({
                message: 'Cet email est déjà utilisé'
            });
        }

        const user = await User.create({ name, email, age, role });

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Supprimer un utilisateur (DELETE /api/users/:id)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            message: 'Utilisateur supprimé avec succès',
            id: req.params.id
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};

