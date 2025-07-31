const mongoose = require('mongoose');

const ShopVerificationSchema  = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    verificationCode: { type: String, required: true },
})

const ShopVerificationModel = mongoose.model('ShopVerification', ShopVerificationSchema);
module.exports = ShopVerificationModel;