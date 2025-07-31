const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
    articleId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    articleTitle: { type: String, required: true },
    articleType: { type: String, enum: ["kg", "piece"], required: true },
    articlePrice: { type: Number, required: true },
    articleImage: { type: String,required: true },
});


const ArticleModel = mongoose.model('Article', ArticleSchema);
module.exports = ArticleModel;