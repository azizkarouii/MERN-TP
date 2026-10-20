const Article = require('../models/articleModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Utilitaire de génération de Token JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// POST /api/users/register (Inscription)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Nom, email et mot de passe requis'
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({
                message: 'Cet email est déjà utilisé'
            });
        }

        // Hachage sécurisé avec sel (Salt factor = 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            role: 'user'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            });
        }

        res.status(500).json({
            message: err.message
        });
    }
};

// POST /api/users/login (Connexion)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email et mot de passe requis'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Identifiants invalides'
            });
        }

        // Comparaison sécurisée du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Identifiants invalides'
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// GET /api/users/profile (Profil protégé)
const getUserProfile = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// GET /api/users (Admin uniquement)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
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
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: 'Identifiant de ressource invalide (format ObjectId attendu)'
            });
        }

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
        const hasArticles = await Article.findOne({ author: req.params.id });

        if (hasArticles) {
            return res.status(400).json({
                message: 'Impossible de supprimer un utilisateur ayant des articles publies'
            });
        }

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
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: 'Identifiant de ressource invalide (format ObjectId attendu)'
            });
        }

        res.status(500).json({ message: err.message });
    }
};

// 5. Mettre a jour le mot de passe de l'utilisateur connecte (PUT /api/users/update-password)
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: 'oldPassword et newPassword sont requis'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isOldPasswordValid) {
            return res.status(401).json({
                message: 'Ancien mot de passe incorrect'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: 'Mot de passe mis a jour avec succes'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. Promouvoir un utilisateur au role admin (PUT /api/users/:id/role)
const promoteUserToAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        user.role = 'admin';
        await user.save();

        res.status(200).json({
            message: 'Role admin attribue avec succes',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: 'Identifiant de ressource invalide (format ObjectId attendu)'
            });
        }

        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updatePassword,
    promoteUserToAdmin
};

