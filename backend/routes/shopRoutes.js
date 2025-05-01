const express = require("express");
const {
    fetchShopsByCategory,
    fetchShop,
    createShop,
    deleteShop,
    addOrder,
    updateOrderState,
    rateShop,
    verifyShop,
    addArticle,
    deleteArticle,
    updateName,
    updateLastName,
    updateLocalisation,
    updateSpeciality,
    updateProfilePicture,updatePassword,requestReset,verifyCode,resetPassword
} = require("../controllers/shopControllers")
const authMiddleware =require("../authMiddleware")

const router = express.Router();

router.get("/shops/category", fetchShopsByCategory);
router.get("/shop/:id", fetchShop);
router.post("/shop", createShop);
router.post("/verify-shop", verifyShop);
router.post("/shop/:shopId/orders",authMiddleware, addOrder);
router.put("/shopsandusers/:shopId/:userId/orders/:orderId/state",updateOrderState);
router.delete("/shop", deleteShop);
//router.post("/houses-multiple-filter", fetchHousesByMultipleFilters);
router.post("/shop/:shopId/rate", authMiddleware , rateShop );
router.post("/shop/article", authMiddleware , addArticle );
router.delete("/shop/article/:articleId", authMiddleware , deleteArticle );
router.put("/shop/update-name/:shopId",authMiddleware,updateName);
router.put("/shop/update-lastName/:shopId",authMiddleware,updateLastName);
router.put("/shop/update-speciality/:shopId",authMiddleware,updateSpeciality);
router.put("/shop/update-localisation/:shopId",authMiddleware,updateLocalisation);
router.put("/shop/update-profilePicture/:shopId",authMiddleware,updateProfilePicture);
router.put("/shop/update-password/:shopId",authMiddleware,updatePassword);
router.post("/shop/request-reset",requestReset);
router.post("/shop/verify-code",verifyCode);
router.post("/shop/reset-password",resetPassword);

module.exports = router;