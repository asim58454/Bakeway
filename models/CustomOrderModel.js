const mongoose = require("mongoose");

const CustomOrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bakery: { type: mongoose.Schema.Types.ObjectId, ref: "Bakery", required: false }, // ✅ Initially null
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", required: false }, // ✅ Add this line
    name: String,
    email: String,
    phoneNumber: String,
    deliveryAddress: String,
    preferredDelivery: String,
    productName: String,
    status: { type: String, default: "Pending" }, // Pending | Accepted | Rejected
    deliveryStatus: { type: String, default: "Pending" },
});

module.exports = mongoose.model("CustomOrder", CustomOrderSchema);
