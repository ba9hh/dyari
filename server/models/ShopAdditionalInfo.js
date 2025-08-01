const mongoose = require('mongoose');

const ShopAdditionalInfoSchema  = mongoose.Schema({
    shopId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  facebook:  String,
  instagram: String,
  tiktok:    String,
  youtube:   String,
  whatsapp:  String,
  locationExact:  String,
});
const ShopAdditionalInfoModel = mongoose.model('ShopAdditionalInfo', ShopAdditionalInfoSchema);
module.exports = ShopAdditionalInfoModel;