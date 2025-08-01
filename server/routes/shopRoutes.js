const express = require("express");
const {
    fetchShops, fetchShop, createShop,createShop1,
    fetchShopInformation, fetchShopArticles, fetchShopOrders,
    updateProfilePicture, updatePassword, updateInformation, deleteShop,
} = require("../controllers/shopControllers")
const authMiddleware = require("../authMiddleware")

const router = express.Router();

router.get("/shops", authMiddleware, fetchShops);
router.get("/shop/:id", fetchShop);
router.post("/shop", createShop);
router.post("/create-shop", createShop1);

router.get("/shop/:shopId/information", fetchShopInformation);
router.get("/shop/:shopId/articles", fetchShopArticles);
router.get("/shop/orders/:filter", authMiddleware, fetchShopOrders);

router.put('/shop/information', authMiddleware, updateInformation);
router.put("/shop/profile-picture", authMiddleware, updateProfilePicture);
router.post("/shop/update-password",authMiddleware,updatePassword);
router.delete("/shop", authMiddleware, deleteShop);

module.exports = router;