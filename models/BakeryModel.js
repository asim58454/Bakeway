const mongoose = require("mongoose");

const BakerySchema = new mongoose.Schema({
  bakeryName: String,
  email: String,
  password: String,
  status: { type: String, default: "Pending" }, // "Pending" | "Approved"
  bakeryType: { type: String, enum: ["Local Based", "Home Based"], required: true }, // ✅ NEW FIELD
  menu: [
    {
      name: String,
      price: Number,
      image: String, // Image URL for the product
    },
  ],
});

module.exports = mongoose.model("Bakery", BakerySchema);