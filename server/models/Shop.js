const mongoose = require('mongoose');


const ShopSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    localisation: { type: String, required: true },
    gender: { type: String, enum: ["Homme", "Femme"], required: true },
    averageRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    sumOfRatings: { type: Number, default: 0 },
    speciality: [
        {
            type: String,
            enum: ["sales", "sucres", "gateaux", "biscuit"],
        }]
    ,
    profilePicture: { type: String, default: "https://obhlpgxxiotewfhcvdaw.supabase.co/storage/v1/object/public/images/1753197818753-icon-7797704_640.png" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    numberOfArticles: { type: Number, default: 0, required: true },
}
);

const ShopModel = mongoose.model('Shop', ShopSchema);

module.exports = ShopModel;