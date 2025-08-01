const Order = require('../models/Order');
const Shop = require('../models/Shop');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'zedtourheart@gmail.com', // Your email
        pass: 'kjqk ssnh ozdc ajsj',      // Your email password
    },
});

exports.createOrder = async (req, res) => {
    try {
        const { shopId, userId,userNeededDate, userPhoneNumber, orderItems, orderTotalAmount } = req.body;
        if (!shopId || !userId || !userPhoneNumber || !userNeededDate || !orderItems || !orderTotalAmount) {
            return res.status(400).json({ message: 'All fields are required' });
        }
         const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const newOrder = new Order({
            shopId,
            userId,
            userPhoneNumber,
            userNeededDate,
            orderItems,
            orderTotalAmount,
            orderState: 'pending', 
            orderDate: new Date(), 
        });
        const mailOptions = {
            from: 'zedtourheart@gmail.com',
            to: shop.email,
            subject: 'Commande',
            text: `Vous avez une commande`,
        };

        await newOrder.save();
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.getOrdersByShop = async (req, res) => {
    const { shopId } = req.params;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    try {

        if (!shopId) {
            return res.status(400).json({ message: 'Shop ID is required' });
        }
        const skip = (page - 1) * limit;

        const orders = await Order.find({ shopId })
            .populate('userId', 'name lastName email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this shop' });
        }

        // const total = await Order.countDocuments({ shopId });
        // res.json({
        //     orders,
        //     total,
        //     page,
        //     pages: Math.ceil(total / limit),
        // });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.updateOrderState = async (req, res) => {
    const { orderId } = req.params;
    const { orderState } = req.body;

    try {
        if (!orderId || !orderState) {
            return res.status(400).json({ message: 'Order ID and state are required' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderState },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order state updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order state:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.getOrdersByUser = async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId })
            .populate('shopId', 'name lastName localisation')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        // const total = await Order.countDocuments({ userId });
        // res.json({
        //     orders,
        //     total,
        //     page,
        //     pages: Math.ceil(total / limit),
        // });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
