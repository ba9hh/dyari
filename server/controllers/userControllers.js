const User = require("../models/User");
const Order = require("../models/Order");
const Rating = require("../models/Rating");
const Shop = require("../models/Shop");
const dayjs = require('dayjs')
const mongoose = require('mongoose');


exports.fetchUserInformation = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('name email profilePicture');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user information:", error);
        res.status(500).json({ message: "Failed to fetch user information", error });
    }
}
exports.fetchUserOrders1 = async (req, res) => {
    const { filter } = req.params;
    const userId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 8;

    const query = { userId };
    const allowedStatuses = ["pending", "accepted", "rejected"];
    if (allowedStatuses.includes(filter)) {
        query.orderState = filter;
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const skip = (page - 1) * limit;
    const now = dayjs();
    const boundaries = {
        todayStart: now.startOf('day'),
        yesterdayStart: now.subtract(1, 'day').startOf('day'),
        lastWeekStart: now.subtract(7, 'day').startOf('day'),
        lastTwoWeeksStart: now.subtract(14, 'day').startOf('day'),
        lastMonthStart: now.subtract(1, 'month').startOf('day'),
        last3MonthsStart: now.subtract(3, 'month').startOf('day'),
        last6MonthsStart: now.subtract(6, 'month').startOf('day'),
        lastYearStart: now.subtract(1, 'year').startOf('day')
    };


    try {
        const orders = await Order.find(query)
            .populate('shopId', 'name lastName email')
            .populate('orderItems.articleId', 'articleTitle articleType articlePrice articleImage')
            .skip(skip)
            .limit(limit)
            .sort({ orderDate: -1 })

        const buckets = {
            today: [],
            yesterday: [],
            lastWeek: [],
            lastTwoWeeks: [],
            lastMonth: [],
            last3Months: [],
            last6Months: [],
            lastYear: [],
            older: []
        };
        if (!orders.length) {
            return res.json({
                ...buckets,
                total: 0,
                totalPages: 0,
            });
        }

        orders.forEach(order => {
            const od = dayjs(order.orderDate);

            if (od.isSame(boundaries.todayStart, 'day')) {
                buckets.today.push(order);
            }
            else if (od.isSame(boundaries.yesterdayStart, 'day')) {
                buckets.yesterday.push(order);
            }
            else if (od.isAfter(boundaries.lastWeekStart)) {
                buckets.lastWeek.push(order);
            }
            else if (od.isAfter(boundaries.lastTwoWeeksStart)) {
                buckets.lastTwoWeeks.push(order);
            }
            else if (od.isAfter(boundaries.lastMonthStart)) {
                buckets.lastMonth.push(order);
            }
            else if (od.isAfter(boundaries.last3MonthsStart)) {
                buckets.last3Months.push(order);
            }
            else if (od.isAfter(boundaries.last6MonthsStart)) {
                buckets.last6Months.push(order);
            }
            else if (od.isAfter(boundaries.lastYearStart)) {
                buckets.lastYear.push(order);
            }
            else {
                buckets.older.push(order);
            }
        });
        const total = await Order.countDocuments({ userId });

        return res.json({
            ...buckets,
            total,
            totalPages: Math.ceil(total / limit),
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
exports.likeShop = async (req, res) => {
    const  userId  = req.user._id;
    const { shopId } = req.params;
    try {

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isLiked = user.likedShops.includes(shopId);

        if (isLiked) {
            user.likedShops = user.likedShops.filter(id => id.toString() !== shopId);
        } else {
            user.likedShops.push(shopId);
        }

        await user.save();

        res.status(200).json({ likedShops: user.likedShops, liked: !isLiked });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.fetchUserLikedShops = async (req, res) => {
    const userId = req.user._id;
    try {
        const likedShops = await User.findById(userId).select('likedShops').populate('likedShops', 'name lastName localisation speciality profilePicture averageRating totalRating');
        if (!likedShops) {
            return res.status(404).json({ message: "likedShops not found" });
        }
        res.status(200).json(likedShops);
    } catch (error) {
        console.error("Error fetching likedShops information:", error);
        res.status(500).json({ message: "Failed to fetch likedShops information", error });
    }
}
exports.fetchUserRatedShops = async (req, res) => {
    const  userId = req.user._id;
    try {
        // Find ratings by the user
        const ratedShops = await Rating.find({ userId }).populate({
            path: 'shopId',
            select: 'name lastName localisation speciality profilePicture averageRating totalRating'
        });

        res.status(200).json(ratedShops);
    } catch (error) {
        console.error("Error fetching rated shops:", error);
        res.status(500).json({ message: "Failed to fetch rated shops", error });
    }
};
exports.isShopLikedByUser = async (req, res) => {
    const {  shopId } = req.params;
    const userId = req.user?._id;
    if (!userId) {
        return res.status(200).json({ liked: false });
    }
    try {
        const user = await User.findById(userId).select('likedShops');
        if (!user) {
            return res.status(404).json({ liked: false, message: 'User not found' });
        }
        const liked = user.likedShops.some(
            (likedShopId) => likedShopId.toString() === shopId
        );

        return res.status(200).json({ liked });
    } catch (err) {
        console.error("Error checking liked shop:", err);
        res.status(500).json({ liked: false, message: 'Server error' });
    }
};
exports.updateProfilePicture = async (req, res) => {
    const { userId } = req.params;
    const { newProfilePicture } = req.body;
    console.log(newProfilePicture)
    try {
        // Expecting { speciality: [ ... ] } in the request body
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: newProfilePicture },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.deleteUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.user._id;

        const userRatings = await Rating.find({ userId }).session(session);

        for (let { shopId, rating } of userRatings) {
            const shop = await Shop.findById(shopId).session(session);
            if (!shop) continue;

            shop.totalRating = Math.max(0, shop.totalRating - 1);
            shop.sumOfRatings = Math.max(0, shop.sumOfRatings - rating);

            shop.averageRating = shop.totalRating > 0
                ? shop.sumOfRatings / shop.totalRating
                : 0;

            await shop.save({ session });
        }
        await Rating.deleteMany({ userId }).session(session);
        await User.findByIdAndDelete(userId).session(session);

        await session.commitTransaction();
        res.clearCookie('authToken');
        res.status(200).json({ message: 'Account and ratings cleaned up.' });
    } catch (err) {
        await session.abortTransaction();
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
        session.endSession();
    }
};
