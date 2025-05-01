const { query } = require("express");
const mongoose = require("mongoose");
const Shop = require("../models/Shop");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const bcryptSalt = bcrypt.genSaltSync(10);

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'zedtourheart@gmail.com', // Your email
        pass: 'kjqk ssnh ozdc ajsj',      // Your email password
    },
});

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
exports.fetchShopsByCategory = async (req, res) => {
    try {
        const { type, localisation, page = "1", limit = "10" } = req.query;

        let query = {};
        if (type) query.speciality = type;
        if (localisation) {
            query.localisation = localisation;
        }
        query.isVerified = true;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const shops = await Shop.find(query)
            .select('name lastName localisation averageRating totalRating speciality profilePicture articles isVerified')
            .sort({ totalRating: -1 })  // Sort by newest first
            .skip(skip)
            .limit(limitNumber);

        const totalShops = await Shop.countDocuments(query);

        res.status(200).json({
            success: true,
            totalShops,
            totalPages: Math.ceil(totalShops / limitNumber),
            currentPage: pageNumber,
            shops
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching shops", error });
    }
}

exports.deleteShop = async (req, res) => {
    try {

    } catch {

    }
}
exports.createShop = async (req, res) => {
    const {
        name,
        lastName,
        localisation,
        gender,
        profilePicture,
        speciality,
        articles,
        email,
        password,
    } = req.body;

    try {
        // Check if a shop with the provided email already exists
        const existingShop = await Shop.findOne({ email });

        // Generate a six-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        // Asynchronously hash the password
        const hashedPassword = await bcrypt.hash(password, bcryptSalt);

        // If shop exists and is verified, do nothing
        if (existingShop && existingShop.isVerified) {
            return res.status(200).json({
                message: "Email already exists and is verified."
            });
        }

        // Set up email options
        const mailOptions = {
            from: 'zedtourheart@gmail.com',
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`,
        };

        // If the shop exists but is not verified, update its data
        if (existingShop && !existingShop.isVerified) {
            existingShop.name = name;
            existingShop.lastName = lastName;
            existingShop.localisation = localisation;
            existingShop.gender = gender;
            existingShop.profilePicture = profilePicture;
            existingShop.speciality = speciality;
            existingShop.articles = articles;
            existingShop.password = hashedPassword;
            existingShop.verificationCode = verificationCode;
            existingShop.isVerified = false;

            await existingShop.save();
            await transporter.sendMail(mailOptions);

            return res.status(200).json({
                success: true,
                message: "Existing unverified shop updated and verification email sent.",
                verificationCode, // Optionally, you can omit sending this back
            });
        }

        // Otherwise, create a new shop record
        const newShop = new Shop({
            name,
            lastName,
            localisation,
            gender,
            profilePicture,
            speciality,
            articles,
            email,
            password: hashedPassword,
            verificationCode,
            isVerified: false,
        });


        await newShop.save();
        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: "Shop created and verification email sent successfully!",
            verificationCode, // Optionally, you can omit sending this back
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to process shop",
            error: error.message,
        });
    }
}

exports.addOrder = async (req, res) => {
    const { shopId } = req.params; // Extract shopId from request parameters
    const userId = req.user._id;
    const { clientPhoneNumber, items, totalAmount } = req.body; // Extract order data from the body
    try {
        // Find the shop by its ID
        const shop = await Shop.findById(shopId);
        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'zedtourheart@gmail.com', // Your email
                pass: 'kjqk ssnh ozdc ajsj',      // Your email password
            },
        });

        // Set up email options
        const mailOptions = {
            from: 'zedtourheart@gmail.com',
            to: shop.email,
            subject: 'Commande',
            text: `Vous avez une commande`,
        };
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const orderId = new mongoose.Types.ObjectId();

        // Create the new order object
        const shopOrder = {
            _id: orderId,
            client: userId,
            clientName: user.name,
            clientLastName: user.lastName,
            clientPhoneNumber,
            items,
            totalAmount,
            date: Date.now(), // Default to the current date if not provided
        };
        const clientOrder = {
            _id: orderId,
            shop: shopId,
            shopName: shop.name,
            shopLastName: shop.lastName,
            items,
            totalAmount,
            date: Date.now(), // Default to the current date if not provided
        };

        // Add the new order to the shop's orders array
        shop.orders.push(shopOrder);
        user.orders.push(clientOrder);

        // Save the shop document with the new order
        await shop.save();
        await user.save();
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Order added successfully" });
    } catch (error) {
        console.error("Error adding order:", error);
        res.status(500).json({ message: "Failed to add order", error });
    }
};
exports.updateOrderState = async (req, res) => {
    try {
        const { shopId, userId, orderId } = req.params;
        const { state } = req.body;

        const validStates = ["en attente", "accepté", "refusé"];
        if (!validStates.includes(state)) {
            return res.status(400).json({ message: "Invalid order state" });
        }
        const updatedShop = await Shop.findOneAndUpdate(
            { _id: shopId, "orders._id": orderId }, // Find the shop with the order
            { $set: { "orders.$.state": state } }, // Update the specific order state
            { new: true } // Return updated document
        );
        if (!updatedShop) {
            return res.status(404).json({ message: "Shop not found" });
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, "orders._id": orderId }, // Find the shop with the order
            { $set: { "orders.$.state": state } }, // Update the specific order state
            { new: true } // Return updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Order updated successfully", updatedShop });

    } catch {

    }
}
exports.rateShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { rating } = req.body; // Expected rating value (1-5)

        // Validate rating value
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        // Check if the logged in user has an accepted order for this shop
        const hasAcceptedOrder = req.user.orders.some(order =>
            order.shop.toString() === shopId && order.state == "accepté"
        );

        if (!hasAcceptedOrder) {
            return res.status(403).json({ message: 'You must have an accepted order from this shop to rate it.' });
        }

        // Retrieve the shop
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Check if user has already rated the shop
        const existingRatingIndex = shop.rating.findIndex(r => r.user.toString() === req.user._id.toString());

        if (existingRatingIndex > -1) {
            // Update existing rating
            shop.rating[existingRatingIndex].rating = rating;
        } else {
            // Add new rating
            shop.rating.push({ user: req.user._id, rating });
            shop.totalRating = (shop.totalrating || 0) + 1;
        }

        // Recalculate the average rating
        const total = shop.rating.reduce((acc, curr) => acc + curr.rating, 0);
        shop.averageRating = Number((total / shop.totalRating).toFixed(1));

        await shop.save();

        res.status(200).json({ message: 'Rating submitted successfully.', shop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.verifyShop = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        // Find shop by email
        const shop = await Shop.findOne({ email });
        if (!shop) {
            return res.status(404).json({ success: false, message: "Shop not found" });
        }

        // Check if the verification code matches
        if (shop.verificationCode !== verificationCode) {
            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }

        // Mark shop as verified and clear the verification code
        shop.isVerified = true;
        shop.verificationCode = null;
        await shop.save();
        const token = jwt.sign({ shopId: shop._id, role: 'shop' }, "Secret", {
            expiresIn: '7d',
        });

        // Set the token in an httpOnly cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
            sameSite: 'Strict',
        });
        return res.status(200).json({ success: true, message: "Shop verified successfully!", shop: { id: shop._id, name: shop.name, email: shop.email, profilePicture: shop.profilePicture } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

exports.addArticle = async (req, res) => {
    const shopId = req.user._id;
    const { type, price, image } = req.body;
    console.log(type)

    try {
        // Find the shop document by its ID
        const shop = await Shop.findById(shopId);
        console.log(shop)
        console.log(shop.articles)
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Add the new article to the articles array
        shop.articles.push({ type: type, price: price, image: image });

        // Save the updated shop document
        await shop.save();

        res.status(201).json({
            shop: {
                _id: shop._id,
                name: shop.name,
                lastName: shop.lastName,
                gender: shop.gender,
                profilePicture: shop.profilePicture,
                email: shop.email,
                articles: shop.articles,
                orders: shop.orders,
                localisation: shop.localisation,
                speciality: shop.speciality,
                totalRating: shop.totalRating,
                averageRating: shop.averageRating
            }
        });
    } catch (error) {
        console.error('Error adding article:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteArticle = async (req, res) => {
    const { articleId } = req.params;
    const shopId = req.user._id
    console.log(shopId)

    try {
        // Find the shop by its ID
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Filter out the article with the matching _id
        shop.articles = shop.articles.filter(
            (article) => article._id.toString() !== articleId
        );

        // Save the updated shop document
        await shop.save();

        res.status(200).json({
            message: 'Article deleted', shop: {
                _id: shop._id,
                name: shop.name,
                lastName: shop.lastName,
                gender: shop.gender,
                profilePicture: shop.profilePicture,
                email: shop.email,
                articles: shop.articles,
                orders: shop.orders,
                localisation: shop.localisation,
                speciality: shop.speciality,
                totalRating: shop.totalRating,
                averageRating: shop.averageRating
            }
        });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}
exports.updateName = async (req, res) => {
    const shopId = req.user._id;
    const { newName } = req.body;
    console.log(newName)
    console.log(shopId)
    try {
        // Expecting { speciality: [ ... ] } in the request body
        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { name: newName },
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
exports.updateLastName = async (req, res) => {
    const shopId = req.user._id;
    const { newLastName } = req.body;
    try {
        // Expecting { speciality: [ ... ] } in the request body
        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { lastName: newLastName },
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
exports.updateSpeciality = async (req, res) => {
    const shopId = req.user._id;
    const { newSpeciality } = req.body;
    try {
        // Expecting { speciality: [ ... ] } in the request body
        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { speciality: newSpeciality },
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
exports.updateLocalisation = async (req, res) => {
    const shopId = req.user._id;
    const { newLocalisation } = req.body;
    try {
        // Expecting { speciality: [ ... ] } in the request body
        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { localisation: newLocalisation },
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
exports.updateProfilePicture = async (req, res) => {
    const shopId = req.user._id;
    const { newProfilePicture } = req.body;
    console.log(newProfilePicture)
    try {
        // Expecting { speciality: [ ... ] } in the request body
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
    console.log(currentPassword)
    console.log(newPassword)
    console.log(shopId)
    try {
        console.log("something wrong")
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        console.log(shop)
        const isMatch = await bcrypt.compare(currentPassword, shop.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, bcryptSalt);
        console.log("before hashing", shop.password)
        shop.password = hashedPassword;
        await shop.save();
        console.log("after hashing", shop.password)
        res.status(200).json(shop)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.requestReset = async (req, res) => {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'A valid email is required.' });
    }
    try {
        const shop = await Shop.findOne({ email });
        if (!shop) {
            return res.status(400).json({ message: 'Invalid Email.' });
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Set up email options
        const mailOptions = {
            from: 'zedtourheart@gmail.com',
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`,
        };
        shop.verificationCode = verificationCode;
        await shop.save();
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "verification code is sent" })
    } catch (error) {
        console.error('Error in requestReset:', error);
        res.status(500).json({ error: error.message })
    }

}
exports.verifyCode = async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required.' });
    }
    try {
        const shop = await Shop.findOne({ email })
        if (!shop) {
            return res.status(400).json({ message: 'Invalid Email.' });
        }
        const isMatch = shop.verificationCode == code;
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong code.' });
        }
        shop.verificationCode = null;
        await shop.save();
        res.status(200).json({ message: 'Correct code' })

    } catch (error) {
        console.error('Error in verifyCode:', error);
        res.status(500).json({ error: error.message })
    }
}
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required.' });
    }
    try {
        const shop = await Shop.findOne({ email });
        if (!shop) {
            return res.status(400).json({ message: 'Invalid Email.' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, bcryptSalt);
        shop.password = hashedPassword;
        await shop.save();
        res.status(200).json({ message: "Password reset successfully" })
    } catch (error) {
        console.error('Error in resetting password:', error);
        res.status(500).json({ error: error.message })
    }

}