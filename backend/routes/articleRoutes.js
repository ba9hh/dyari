const express = require("express");

const { createArticle,createArticles,fetchArticleById,updateArticle,deleteArticle } = require("../controllers/articleControllers");

const router = express.Router();

router.get("/article/:articleId", fetchArticleById);
router.post("/articles", createArticles);
router.post("/article", createArticle);
router.put("/article/:articleId", updateArticle);
router.delete("/article/:articleId",deleteArticle);


module.exports = router;