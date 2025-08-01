const mongoose = require('mongoose');


const RatingSchema = mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
});

const RatingModel = mongoose.model('Rating', RatingSchema);

module.exports = RatingModel;