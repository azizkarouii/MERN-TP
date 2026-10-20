const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Routes d'authentification publiques
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

// Route privée protégée par token JWT
router.get('/profile', protect, UserController.getUserProfile);
router.put('/update-password', protect, UserController.updatePassword);

// Route réservée aux administrateurs (JWT valide + rôle admin requis)
router.get('/', protect, adminOnly, UserController.getAllUsers);
router.put('/:id/role', protect, adminOnly, UserController.promoteUserToAdmin);

// Routes CRUD utilisateur conservées
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;


