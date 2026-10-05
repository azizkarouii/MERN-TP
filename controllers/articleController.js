const articles = [
    {
        id: 1,
        title: "Bienvenue sur le blog",
        author: "Admin"
    },
    {
        id: 2,
        title: "Mon premier serveur Express",
        author: "Aya"
    },
    {
        id: 3,
        title: "Tester une API avec Postman",
        author: "Aya"
    }
];
let prochainId = 4;

const getAllArticles = (req, res) => {
    const { author } = req.query;

    let resultat = articles;

    if (author) {
        resultat = articles.filter(a => a.author === author);
    }

    res.json({
        total: resultat.length,
        articles: resultat
    });
};

const getArticleById = (req, res) => {
    const id = Number(req.params.id);

    const article = articles.find(a => a.id === id);

    if (!article) {
        return res.status(404).json({
            error: `Article ${id} introuvable`
        });
    }

    res.status(200).json(article);
};
const createArticle = (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            error: "Le titre et l'auteur sont obligatoires"
        });
    }

    const nouvelArticle = {
        id: prochainId,
        title: title,
        author: author
    };

    prochainId = prochainId + 1;

    articles.push(nouvelArticle);

    res.status(201).json({
        message: "Article créé",
        article: nouvelArticle
    });
};

// 4. Mettre à jour un article existant (PUT /api/articles/:id)

const updateArticle = (req, res) => {
    const id = Number(req.params.id);

    const { title, author } = req.body;

    // On recherche l'index de l'article dans le tableau
    const index = articles.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: `Article ${id} introuvable`
        });
    }

    // Mise à jour partielle ou totale
    if (title) {
        articles[index].title = title;
    }

    if (author) {
        articles[index].author = author;
    }

    res.status(200).json({
        message: "Article mis à jour",
        article: articles[index]
    });
};

const deleteArticle = (req, res) => {
    const id = Number(req.params.id);
    const index = articles.findIndex(article => article.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: `Article ${id} introuvable`
        });
    }

    const articleSupprime = articles.splice(index, 1)[0];

    res.status(200).json({
        message: "Article supprimé",
        article: articleSupprime
    });
};

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};