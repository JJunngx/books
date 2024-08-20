const { Schema, model } = require("mongoose");
module.exports = model(
  "Order",
  new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    books: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Book" },
        quantity: Number,
      },
    ],
    status: {
      type: String,
      enum: ["waiting for pay", "paid"],
      default: "waiting for pay",
    },
    totalPrice: Number,
    delivery: {
      type: String,
      enum: ["waiting for processing", "shipping", "delivered"],
      default: "waiting for processing",
    },
    address: String,
    phone: Number,
    fullname: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);
