const Rating = require('../models/Rating');
const Order = require('../models/Order');
const Shop = require('../models/Shop');

exports.rateShop = async (req, res) => {
    try {
        const userId = req.user._id;            
        const { shopId } = req.params;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }
        const shop = await Shop.findById(shopId);
        if (!shop) return res.status(404).json({ message: 'Shop not found.' });

        const existingRating = await Rating.findOne({ userId, shopId });

        let updatedSum = shop.sumOfRatings;
        let updatedTotal = shop.totalRating;

        if (existingRating) {
            // User already rated — update sum
            updatedSum = updatedSum - existingRating.rating + rating;
            await Rating.updateOne({ _id: existingRating._id }, { rating });
        } else {
            // New rating
            updatedSum += rating;
            updatedTotal += 1;
            await Rating.create({ userId, shopId, rating });
        }

        const newAverage = updatedSum / updatedTotal;

        // Update the shop
        shop.sumOfRatings = updatedSum;
        shop.totalRating = updatedTotal;
        shop.averageRating = newAverage;
        await shop.save();

        res.status(200).json({
            message: 'Rating submitted.',
            averageRating: shop.averageRating.toFixed(2),
            totalRaters: shop.totalRating
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.canRateShop = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { shopId } = req.params;
        const hasAcceptedOrder = await Order.exists({
            userId,
            shopId,
            orderState: 'accepted'
        });
        return res.status(200).json({ canRate: Boolean(hasAcceptedOrder) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getUserRating = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { shopId } = req.params;

        const ratingDoc = await Rating.findOne({
            userId,
            shopId,
        });

        if (!ratingDoc) {
            // user hasn’t rated this shop yet
            return res.json({ rating: null });
        }

        res.status(200).json({ rating: ratingDoc.rating });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.fetchRatingsByShop = async (req, res) => {

}



exports.fetchRatingsByUser = async (req, res) => {
}
exports.deleteRating = async (req, res) => {

}
