const Article = require('../models/Article');
const Shop = require('../models/Shop')

exports.fetchArticleById = async (req, res) => {
    const { articleId } = req.params;

    try {
        // Validate articleId
        if (!articleId) {
            return res.status(400).json({ message: 'Article ID is required' });
        }

        // Find the article by ID
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.createArticle = async (req, res) => {
    const { shopId, articleTitle, articleType, articlePrice, articleImage } = req.body;
    try {
        console.log(shopId, articleTitle, articleType, articlePrice, articleImage)
        if (!shopId || !articleTitle || !articleType || !articlePrice || !articleImage) {
            return res.status(400).json({ message: 'Shop ID, type, and price are required' });
        }
        const newArticle = new Article({
            shopId,
            articleTitle,
            articleType,
            articlePrice,
            articleImage
        });
        await newArticle.save();
        await Shop.findByIdAndUpdate(
            shopId,
            { $inc: { numberOfArticles: 1 } },
            { new: true }
        );
        res.status(201).json({ message: 'Article created successfully', article: newArticle });
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.createArticles = async (req, res) => {
    try {
        const { shopId, articles } = req.body;

        // Validate input
        if (!shopId || !Array.isArray(articles) || articles.length === 0) {
            return res.status(400).json({ message: 'Shop ID and articles array are required' });
        }

        // Validate each article
        const validArticles = articles.every(article =>
            article.articleTitle &&
            article.articleDescription &&
            article.articleType &&
            article.articlePrice &&
            article.articleImage
        );

        if (!validArticles) {
            return res.status(400).json({ message: 'Each article must include title, description, type, price, and image' });
        }

        // Add shopId to each article
        const articlesToCreate = articles.map(article => ({
            ...article,
            shopId
        }));

        // Insert all articles at once
        const createdArticles = await Article.insertMany(articlesToCreate);

        res.status(201).json({
            message: 'Articles created successfully',
            articles: createdArticles
        });

    } catch (error) {
        console.error('Error creating articles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateArticle = async (req, res) => {
    const { articleId } = req.params;
    const { articleTitle, articleType, articlePrice, articleImage } = req.body;

    try {
        // Validate required fields
        if (!articleId || !articleTitle  || !articleType || !articlePrice || !articleImage) {
            return res.status(400).json({ message: 'Article ID, title, type, price, and image are required' });
        }

        // Update the article
        const updatedArticle = await Article.findByIdAndUpdate(
            articleId,
            { articleTitle, articleType, articlePrice, articleImage },
            { new: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json({ message: 'Article updated successfully', article: updatedArticle });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.deleteArticle = async (req, res) => {
    const { articleId } = req.params;
    try {
        // Validate articleId
        if (!articleId) {
            return res.status(400).json({ message: 'Article ID is required' });
        }
        const deletedArticle = await Article.findByIdAndDelete(articleId);
        if (!deletedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        await Shop.findByIdAndUpdate(
            deletedArticle.shopId,
            { $inc: { numberOfArticles: -1 } },
            { new: true }
        );
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

