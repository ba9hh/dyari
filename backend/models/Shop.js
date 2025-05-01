const mongoose = require('mongoose');


const ShopSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    localisation: { type: String, required: true },
    gender: { type: String, enum: ["Homme", "Femme"], required: true },
    rating:  [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                rating: { type: Number, required: true, min: 1, max: 5 }
            }
        ],
    averageRating: { type: Number, default: 0 },
    totalRating:{ type: Number, default: 0 },
    speciality: [
        {
            type: String,
            enum: ["sales", "sucres", "gateaux", "biscuit"],
        }]
    ,
    profilePicture: { type: String, default: "" },
    articles: [
        {

            type: { type: String, enum: ["kg", "piéce"], required: true },
            price: { type: Number, required: true },
            image: { type: String },
        },
    ],
    orders: [
        {
            client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            clientName: { type: String },
            clientLastName: { type: String },
            clientPhoneNumber: { type: String },
            items: [
                {
                    type: { type: String, enum: ["kg", "piéce"], required: true },
                    price: { type: Number, required: true },
                    image: { type: String },
                    quantity: { type: Number, required: true },
                },
            ],
            totalAmount: { type: Number, required: true },
            state: { type: String, enum: ["en attente", "accepté", "refusé"], required: true, default: "en attente", },
            date: { type: Date, default: Date.now },
        },
    ],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationCode :{type:String , },
    isVerified :{type:String , required:true},
}
);

const ShopModel = mongoose.model('Shop', ShopSchema);

module.exports = ShopModel;