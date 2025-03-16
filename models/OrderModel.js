const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bakery: { type: mongoose.Schema.Types.ObjectId, ref: "Bakery" },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", default: null }, // Rider Assigned
    items: [{ name: String, price: Number, quantity: Number }],
    totalAmount: Number,
    status: { type: String, default: "Pending" }, // Pending | Accepted | Rejected | Ready for Delivery
    deliveryStatus: { type: String, default: "Pending" }, // Pending | Assigned | Out for Delivery | Delivered
});

module.exports = mongoose.model("Order", OrderSchema);
