const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Shop = require('./models/Shop');

const authMiddleware = async (req, res, next) => {

  try {
    const token = req.cookies.authToken;
    if (!token) {
      req.user = null;
      return next();
    }

    jwt.verify(token, process.env.JWT_SECRET || "Secret", async (err, decoded) => {
      if (err) {
        req.user = null;
        return next();
      }
      try {
        let userData = null;
        if (decoded.role === 'user') {
          userData = await User.findById(decoded.userId).select('profilePicture');
        } else if (decoded.role === 'shop') {
          userData = await Shop.findById(decoded.shopId).select('profilePicture');
        }
        req.user = userData ? { ...userData.toObject(), role: decoded.role } : null;
        return next();
      } catch (error) {
        console.error('Error in auth middleware:', error);
        req.user = null;
        return next();
      }
    });
  } catch (error) {
    console.error('Middleware error:', error);
    req.user = null;
    return next();
  }
};

module.exports = authMiddleware;