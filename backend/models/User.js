const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    name: String,
    lastName: String,
    email: { type: String, unique: true },
    profilePicture: { type: String },
    password: String,
    signinMethod: String,
    orders: [
      {
        shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
        shopName :String,
        shopLastName :String,
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
  });


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;