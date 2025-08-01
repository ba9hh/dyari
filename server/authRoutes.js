const express = require("express");
const authMiddleware = require("./authMiddleware");

const {login, googleLogin, validateToken, logout,requestReset,verifyCode,resetPassword} = require("./authControllers");
const router = express.Router();

router.post('/login', login);
router.get('/validateToken', authMiddleware,validateToken);
router.post('/auth/google',googleLogin);
router.post('/logout', logout);
router.post("/shop/request-reset",requestReset);
router.post("/shop/verify-code",verifyCode);
router.post("/shop/reset-password",resetPassword);

module.exports = router;