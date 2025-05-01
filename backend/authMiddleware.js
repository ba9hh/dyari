const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Shop = require('./models/Shop');

const authMiddleware = async (req, res, next) => {
    // try {
    //     const token = req.cookies.authToken;
    //     if (!token) {
    //         return res.status(401).json({ message: 'Unauthorized' });
    //     }
    //     jwt.verify(token, /*process.env.JWT_SECRET*/"Secret", async (err, decoded) => {
    //         if (err) {
    //             return res.status(401).json({ message: 'Invalid token' });
    //         }
    //         try {
    //             // Check if it's a User
    //             let user = await User.findById(decoded.userId).select('-password');
    //             if (user) {
    //                 req.user = user;
    //                 return next(); // Proceed if a user is found
    //             }

    //             // Check if it's a Shop
    //             let shop = await Shop.findById(decoded.shopId);
    //             if (shop) {
    //                 req.user = shop;
    //                 return next(); // Proceed if a shop is found
    //             }

    //             return res.status(404).json({ message: 'Account not found' });

    //         } catch (error) {
    //             return res.status(500).json({ message: 'Server error', error });
    //         }

    //     });
    // } catch (error) {
    //     console.error('Middleware error:', error);
    //     return res.status(500).json({ message: 'Server error' });
    // }
    try {
        const token = req.cookies.authToken;
        
        if (!token) {
          // No token means no authenticated user, but that's fine—simply continue.
          req.user = null;
          return next();
        }
    
        jwt.verify(token, process.env.JWT_SECRET || "Secret", async (err, decoded) => {
          if (err) {
            // If the token is invalid, also treat as no authenticated user.
            req.user = null;
            return next();
          }
          try {
            // First, try to find a User account.
            let user = await User.findById(decoded.userId)
            if (user) {
              req.user = user;
              return next();
            }
            // If not a User, try to find a Shop account.
            let shop = await Shop.findById(decoded.shopId).select('_id name lastName localisation gender averageRating totalRating speciality profilePicture articles orders');
            if (shop) {
              req.user = shop;
              return next();
            }
    
            // No valid account found—set user to null and continue.
            req.user = null;
            return next();
          } catch (error) {
            // Log the error for internal debugging but do not send it to the client.
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