const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Routes d'authentification publiques
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

// Route privée protégée par token JWT
router.get('/profile', protect, UserController.getUserProfile);

// Route réservée aux administrateurs (JWT valide + rôle admin requis)
router.get('/', protect, adminOnly, UserController.getAllUsers);

// Routes CRUD utilisateur conservées
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
