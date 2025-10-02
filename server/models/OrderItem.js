const mongoose = require('mongoose');

const OrderItemSchema = mongoose.Schema({
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
    quantity: { type: Number, required: true }
});


module.exports = OrderItemSchema; 