const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// Remarque : le préfixe '/api/users' sera défini dans server.js.
// Ici, '/' représente donc la racine de la ressource : '/api/users'.
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
