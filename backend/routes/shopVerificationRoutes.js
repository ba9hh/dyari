const express = require('express');
const router = express.Router();
const {
  createVerification,
  verifyAndDelete,
  checkEmailExists,
  checkEmailExistsAndCreateVerificationCode
} = require('../controllers/shopVerificationController');

router.post('/create-verification', createVerification);
router.post('/verify', verifyAndDelete);
router.post('/shop/check-email', checkEmailExists);
router.post('/shop/check-email-and-create-verification', checkEmailExistsAndCreateVerificationCode);




module.exports = router;