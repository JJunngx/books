const { Schema, model } = require("mongoose");
module.exports = model(
  "Book",
  new Schema({
    title: String,
    author: String,
    description: String,
    genre: String,
    price: Number,
    imageUrl: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    count: Number,
  })
);
