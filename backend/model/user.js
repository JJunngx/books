const { Schema, model } = require("mongoose");
module.exports = model(
  "User",
  new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    cart: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Book" },
        quantity: Number,
      },
    ],
    role: {
      type: String,
      enum: ["Customer", "Consultant", "Admin"],
      default: "Customer",
    },
  })
);
