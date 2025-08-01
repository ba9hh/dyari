const Shop = require("../models/Shop");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Article = require("../models/Article")
const Order = require("../models/Order");
const dayjs = require('dayjs')
const Rating = require("../models/Rating");
const ShopAdditionalInfo = require("../models/ShopAdditionalInfo")
const mongoose = require('mongoose');
const bcryptSalt = bcrypt.genSaltSync(10);

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'zedtourheart@gmail.com', // Your email
        pass: 'kjqk ssnh ozdc ajsj',      // Your email password
    },
});
function buildUpsertOps(raw) {
  const setOps = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'string' && v.trim() !== '') {
      setOps[k] = v.trim();
    }
  }
  return { setOps };
}
exports.fetchShops = async (req, res) => {
    const shopId = req.user?._id;
    const role = req.user?.role;
    try {
        const { type, localisation, page = "1", limit = "10" } = req.query;

        let query = {};
        if (type) query.speciality = type;
        if (localisation) {
            query.localisation = localisation;
        }
        let excludedShopId = null;
        if (shopId && role === "shop") {
            const userShop = await Shop.findOne({ _id: shopId }).select('_id');
            if (userShop) {
                query._id = { $ne: userShop._id }; // exclude their own shop
                excludedShopId = userShop._id;
            }
        }
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const shops = await Shop.find(query)
            .select('name lastName localisation averageRating totalRating speciality profilePicture numberOfArticles')
            .sort({ totalRating: -1 })
            .skip(skip)
            .limit(limitNumber);
        const shopsWithArticles = await Promise.all(
            shops.map(async (shop) => {
                const articles = await Article.find({ shopId: shop._id })
                    .select('articleImage')
                    .sort({ createdAt: -1 })
                    .limit(6);

                return {
                    ...shop.toObject(),
                    articles
                };
            })
        );

        const totalShops = await Shop.countDocuments(query);

        res.status(200).json({
            success: true,
            totalShops,
            totalPages: Math.ceil(totalShops / limitNumber),
            currentPage: pageNumber,
            shopsWithArticles
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching shops", error });
    }
}

exports.fetchShop = async (req, res) => {
    const { id } = req.params;
    try {
        const shop = await Shop.findById(id).select('name lastName localisation speciality profilePicture rating articles');;
        if (shop) {
            res.json(shop);
        } else {
            res.status(404).json({ message: "Shop not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.createShop = async (req, res) => {
    const {
        name,
        lastName,
        localisation,
        gender,
        speciality,
        email,
        password,
    } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, bcryptSalt);
        const newShop = new Shop({
            name,
            lastName,
            localisation,
            gender,
            speciality,
            email,
            password: hashedPassword,
        });

        await newShop.save();
        const token = jwt.sign({ shopId: newShop._id, role: 'shop' }, "Secret", {
            expiresIn: '7d',
        });
        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'Strict',
        });
        return res.status(201).json({ shop: { _id: newShop._id, profilePicture: newShop.profilePicture, role: "shop" } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to process shop",
            error: error.message,
        });
    }
}

exports.fetchShopInformation = async (req, res) => {
    const { shopId } = req.params;
    try {
        const shop = await Shop.findById(shopId).select('name lastName localisation gender email speciality profilePicture averageRating totalRating');
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }
        res.status(200).json(shop);
    } catch (error) {
        console.error("Error fetching shop information:", error);
        res.status(500).json({ message: "Failed to fetch shop information", error });
    }
};
exports.fetchShopArticles = async (req, res) => {
    const { shopId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 14;
    try {
        if (!shopId) {
            return res.status(400).json({ message: 'Shop ID is required' });
        }
        const skip = (page - 1) * limit;

        const articles = await Article.find({ shopId })
            .select('articleImage articleType articlePrice')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (articles.length === 0) {
            return res.status(404).json({ message: 'No articles found for this shop' });
        }

        const total = await Article.countDocuments({ shopId });
        res.json({
            articles,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.fetchShopOrders = async (req, res) => {
    const shopId = req.user._id;
    const { filter } = req.params;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const query = { shopId };
    const allowedStatuses = ["pending", "accepted", "rejected"];
    if (allowedStatuses.includes(filter)) {
        query.orderState = filter;
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
        if (!shopId) {
            return res.status(400).json({ message: 'Shop ID is required' });
        }
        const orders = await Order.find(query)
            .populate('userId', 'name lastName email')
            .populate('orderItems.articleId', 'articleTitle articleType articlePrice articleImage')
            .skip(skip)
            .limit(limit)
            .sort({ orderDate: -1 });

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

        const total = await Order.countDocuments({ shopId });

        return res.json({
            ...buckets,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.updateInformation = async (req, res) => {
    const shopId = req.user._id;
    const updateData = req.body;
    try {
        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedShop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.json(updatedShop);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
exports.updateProfilePicture = async (req, res) => {
    const shopId = req.user._id;
    const { newProfilePicture } = req.body;
    try {
        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { profilePicture: newProfilePicture },
            { new: true, runValidators: true }
        );
        if (!updatedShop) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(updatedShop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.updatePassword = async (req, res) => {
    const shopId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    console.log(currentPassword, newPassword);
    try {
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        console.log(shop)
        const isMatch = await bcrypt.compare(currentPassword, shop.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        console.log(isMatch)
        const hashedPassword = await bcrypt.hash(newPassword, bcryptSalt);
        shop.password = hashedPassword;
        await shop.save();
        res.status(200).json(shop)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.deleteShop = async (req, res) => {
    const shopId = req.user.id;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedShop = await Shop.findByIdAndDelete(shopId).session(session);
        if (!deletedShop) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Shop not found' });
        }

        await Rating.deleteMany({ shopId }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.clearCookie('authToken');

        res.status(200).json({ message: 'Shop and associated ratings deleted successfully.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error deleting shop:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createShop1 = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const { general, additional, articles } = req.body;
            if (
                !general ||
                !general.email ||
                !general.password ||
                !general.name ||
                !general.lastName
            ) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Missing required fields' });
            }

            const hashedPassword = await bcrypt.hash(general.password, bcryptSalt);

            const [shop] = await Shop.create(
                [
                    {
                        name: general.name,
                        lastName: general.lastName,
                        localisation: general.localisation,
                        gender: general.gender,
                        speciality: general.speciality,
                        email: general.email,
                        password: hashedPassword,
                    },
                ],
                { session }
            );

            const { setOps } = buildUpsertOps({
                facebook: additional.facebook,
                instagram: additional.instagram,
                tiktok: additional.tiktok,
                youtube: additional.youtube,
                whatsapp: additional.whatsapp,
                locationExact: additional.locationExact,
            });

            if (Object.keys(setOps).length > 0) {
                await ShopAdditionalInfo.create(
                    [{ shopId: shop._id, ...setOps }],
                    { session }
                );
            }

            if (Array.isArray(articles) && articles.length > 0) {
                const articleDocs = articles.map((a) => ({
                    shopId: shop._id,
                    articleTitle: a.title,
                    articleType: a.type,
                    articlePrice: a.price,
                    articleImage: a.image,
                }));

                await Article.insertMany(articleDocs, { session });

                await Shop.findByIdAndUpdate(
                    shop._id,
                    { $inc: { numberOfArticles: articleDocs.length } },
                    { new: true, session }
                );
            }

            const token = jwt.sign(
                { shopId: shop._id, role: 'shop' },
                "Secret",
                { expiresIn: '7d' }
            );

            res.cookie('authToken', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'Strict',
            });

            res.status(201).json({
                shop: {
                    _id: shop._id,
                    profilePicture: shop.profilePicture,
                    role: 'shop',
                },
            });
        });

    } catch (error) {
        console.error('Shop creation error:', error);
        res
            .status(500)
            .json({ success: false, message: 'Server error', error: error.message });
    } finally {
        session.endSession();
    }
};
