const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/articleController');
const { protect } = require('../middlewares/authMiddleware');

// Consultation publique
router.get('/', ArticleController.getAllArticles);
router.get('/:id', ArticleController.getArticleById);

// Operations d'ecriture protegees par authentification JWT
router.post('/', protect, ArticleController.createArticle);
router.put('/:id', protect, ArticleController.updateArticle);
router.delete('/:id', protect, ArticleController.deleteArticle);

module.exports = router;