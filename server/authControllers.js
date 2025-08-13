const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Shop = require('./models/Shop');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(/*process.env.CLIENT_ID*/"739869680076-jlv9amicing7jf86gasmar79v2hel8vb.apps.googleusercontent.com");
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'zedtourheart@gmail.com', 
        pass: 'kjqk ssnh ozdc ajsj',   
    },
});

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const shop = await Shop.findOne({ email });
        if (shop) {
            const isMatch = await bcrypt.compare(password, shop.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
            const token = jwt.sign({ shopId: shop._id, role: 'shop' }, "Secret", {
                expiresIn: '7d',
            });
            res.cookie('authToken', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'Strict',
            });
            return res.json({
                message: 'Login successful',
                token,
                shop: {
                    _id: shop._id,
                    profilePicture: shop.profilePicture,
                    role: 'shop',
                }
            });
        }
        return res.status(404).json({ message: 'Email not found.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

exports.validateToken = async (req, res) => {
    const user = req.user;
    res.json({
        message: 'Token is valid',
        user,
    });
};
exports.googleLogin = async (req, res) => {
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
            user = new User({
                name,
                email,
                profilePicture: picture,
            });
            await user.save();
        } 

        const token = jwt.sign({ userId: user._id, role: 'user' }, /*process.env.JWT_SECRET*/"Secret", {
            expiresIn: '7d', 
        });

        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            sameSite: 'Strict',
        });

        // Return user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                profilePicture: user.profilePicture,
                role: "user"
            },
        });
    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(500).json({ message: 'Google authentication failed' });
    }
};


exports.logout = (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: 'Logout successful' });
};
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
