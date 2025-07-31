const mongoose = require('mongoose');
const OrderItemSchema = require('./OrderItem'); // Assuming you have an OrderItem model 

const OrderSchema = mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userPhoneNumber: { type: String, required: true },
    userNeededDate: { type: Date, required: true },
    orderItems: [OrderItemSchema],
    orderTotalAmount: { type: Number, required: true },
    orderState: { type: String, enum: ["pending", "accepted", "rejected"], required: true, default: "pending", },
    orderDate: { type: Date, default: Date.now },
});


const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;