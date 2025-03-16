const CustomOrder = require("../models/CustomOrderModel");
const Bakery = require("../models/BakeryModel");

// ✅ Submit Custom Order (User)
exports.createCustomOrder = async (req, res) => {
    try {
        const { name, email, phoneNumber, deliveryAddress, preferredDelivery, productName } = req.body;

        const order = await CustomOrder.create({
            user: req.user.id,
            name,
            email,
            phoneNumber,
            deliveryAddress,
            preferredDelivery,
            productName,
            bakery: null, // ✅ Order is open for all bakeries
            status: "Pending",
        });

        res.status(201).json({ message: "Custom Order Placed Successfully", order });
    } catch (error) {
        res.status(400).json({ message: "Custom Order Not Created", error: error.message });
    }
};

// ✅ Fetch Available Custom Orders (For All Approved Bakeries)
exports.getAvailableCustomOrders = async (req, res) => {
    try {
        const bakery = await Bakery.findById(req.user.id);

        if (!bakery) {
            return res.status(404).json({ message: "Bakery Not Found" });
        }

        // ✅ Fetch orders that are not yet assigned to any bakery
        const orders = await CustomOrder.find({ bakery: null, status: "Pending" }).sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching available orders", error: error.message });
    }
};

// ✅ Accept Custom Order (Bakery)
exports.acceptCustomOrder = async (req, res) => {
    try {
        const order = await CustomOrder.findById(req.params.orderId);

        if (!order || order.bakery !== null) {
            return res.status(404).json({ message: "Order Not Available or Already Accepted" });
        }

        order.bakery = req.user.id; // ✅ Assign Bakery ID
        order.status = "Accepted";
        order.deliveryStatus = "Ready for Delivery"
        await order.save();

        res.json({ message: "Order Accepted Successfully", order });
    } catch (error) {
        res.status(400).json({ message: "Order Not Updated", error: error.message });
    }
};

// ✅ Fetch User Custom Orders (For Order History)
exports.getUserCustomOrders = async (req, res) => {
    try {
        const orders = await CustomOrder.find({ user: req.user.id })
            .populate("bakery", "bakeryName bakeryType") // ✅ Bakery name + Bakery Type
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user orders", error: error.message });
    }
};

// ✅ Fetch Admin Custom Orders (For Order History)
exports.getAdminCustomOrders = async (req, res) => {
    try {
        const orders = await CustomOrder.find()
            .populate("user", "name email")
            .populate("bakery", "bakeryName bakeryType") // ✅ Bakery Type add kiya
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};
