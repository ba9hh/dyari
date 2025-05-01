const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Shop = require('./models/Shop');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(/*process.env.CLIENT_ID*/"739869680076-jlv9amicing7jf86gasmar79v2hel8vb.apps.googleusercontent.com");
const bcrypt = require('bcryptjs');


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const shop = await Shop.findOne({ email });

        if (shop) {
            const isMatch = await bcrypt.compare(password, shop.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }
            if (!shop.isVerified) {
                return res.status(403).json({ message: 'Shop is not verified. Please verify your shop before logging in.' });
            }

            // Generate token
            const token = jwt.sign({ shopId: shop._id, role: 'shop' }, "Secret", {
                expiresIn: '7d',
            });

            // Set the token in an httpOnly cookie
            res.cookie('authToken', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
                sameSite: 'Strict',
            });
            const shopData = shop.toObject();
            delete shopData.password; // Remove password field

            return res.json({
                message: 'Login successful',
                shop: {
                    _id: shop._id,
                    name: shop.name,
                    lastName: shop.lastName,
                    gender:shop.gender,
                    profilePicture: shop.profilePicture,
                    email:shop.email,
                    articles:shop.articles,
                    orders:shop.orders,
                    localisation:shop.localisation,
                    speciality:shop.speciality,
                    totalRating:shop.totalRating,
                    averageRating:shop.averageRating
                }
            });
        }

        // If email doesn't exist in either collection
        return res.status(404).json({ message: 'Email not found.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};


//kanah valide nemshou /account sinon y3awed yconnacti
const validateToken = async (req, res) => {
    const user = req.user;
    res.json({
        message: 'Token is valid',
        user,
    });
};
const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: /*process.env.CLIENT_ID*/"739869680076-jlv9amicing7jf86gasmar79v2hel8vb.apps.googleusercontent.com",
        });


        const payload = ticket.getPayload();


        const { name, email, picture } = payload;
        // Check if user already exists in the database
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if not exists
            user = new User({
                name,
                email,
                profilePicture: picture,
            });
            await user.save();
        } else {
            // Update existing user's profile picture and name if changed
            user.name = name;
            user.profilePicture = picture;
            await user.save();
        }

        // Generate a JWT token for the user
        const jwtToken = jwt.sign({ userId: user._id }, /*process.env.JWT_SECRET*/"Secret", {
            expiresIn: '7d', // Token is valid for 7 days
        });

        // Set JWT token in an HTTP-only cookie
        res.cookie('authToken', jwtToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
            sameSite: 'Strict',
        });

        // Return user info
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                orders: user.orders,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(500).json({ message: 'Google authentication failed' });
    }
};


const logout = (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: 'Logout successful' });
};

module.exports = { login, googleLogin, validateToken, logout };