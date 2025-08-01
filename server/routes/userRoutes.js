const express = require("express");
const {fetchUserOrders1,fetchUserLikedShops,fetchUserRatedShops,likeShop ,fetchUserInformation,isShopLikedByUser,updateProfilePicture,deleteUser} = require("../controllers/userControllers");

const router = express.Router();

const authMiddleware = require("../authMiddleware")


router.get("/user/:userId/information", fetchUserInformation);
// router.get("/user/:userId/orders", fetchUserOrders);
router.get("/user/orders/:filter",authMiddleware, fetchUserOrders1);
router.get("/user/liked-shops",authMiddleware, fetchUserLikedShops);
router.get("/user/rated-shops",authMiddleware, fetchUserRatedShops);
router.get("/user/is-shop-liked/:shopId",authMiddleware, isShopLikedByUser);
router.post("/user/shop/:shopId",authMiddleware, likeShop);
router.put("/user/:userId/profile-picture",updateProfilePicture);
router.delete("/user",authMiddleware,deleteUser)




module.exports = router;