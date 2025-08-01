const express = require("express");
const authMiddleware = require("../authMiddleware");
const {
    rateShop,
    fetchRatingsByShop,
    fetchRatingsByUser,
    deleteRating,
    getUserRating,canRateShop
} = require("../controllers/ratingControllers");
const router = express.Router();

router.post("/shop/:shopId/rate", authMiddleware , rateShop );
router.get("/shop/:shopId/rating", authMiddleware, getUserRating);
router.get("/shop/:shopId/can-rate", authMiddleware, canRateShop);


module.exports = router;