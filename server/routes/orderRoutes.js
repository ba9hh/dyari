const express = require("express");
const {
    createOrder,
    getOrderByUser,
    getOrdersByShop,
    updateOrderState,
} = require("../controllers/orderControllers");

const router = express.Router();


router.post("/order", createOrder);
router.patch("/order/:orderId/state", updateOrderState);


module.exports = router;