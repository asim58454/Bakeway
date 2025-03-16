
const Order = require("../models/OrderModel");
const CustomOrder = require("../models/CustomOrderModel");

exports.getPendingOrdersForRider = async (req, res) => {
    try {
        const orders = await Order.find({ deliveryStatus: "Ready for Delivery", rider: null }).populate("bakery user");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPendingCustomizedOrdersForRider = async (req, res) => {
    try {
        
        const customOrders = await CustomOrder.find({  deliveryStatus: "Ready for Delivery"}).populate("bakery user");;

        res.json(customOrders);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};



exports.acceptCustomizedOrderForDelivery = async (req, res) => {
    try {
        const { orderId } = req.params;
        const riderId = req.user.id; // Rider ID from JWT token

        const order = await CustomOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Custom order not found" });
        }

        if (order.rider) {
            return res.status(400).json({ message: "This order is already assigned to another rider." });
        }

        order.rider = riderId; // ✅ Assign rider
        order.deliveryStatus = "Out for Delivery";

        await order.save();
        res.json({ message: "Custom order assigned for delivery", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.completeCustomizedOrderDelivery = async (req, res) => {
    try {
        const { orderId } = req.params;
        const riderId = req.user.id; // Rider ID from token

        const order = await CustomOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Custom order not found" });
        }

        if (!order.rider) {
            return res.status(403).json({ message: "No rider assigned to this order" });
        }

        if (order.rider.toString() !== riderId) {
            return res.status(403).json({ message: "You are not assigned to this order" });
        }

        order.deliveryStatus = "Delivered";

        await order.save();
        res.json({ message: "Custom order delivery completed successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.acceptOrderForDelivery = async (req, res) => {
    try {
        const { orderId } = req.params;
        const riderId = req.user.id; // Rider ID from JWT token

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.rider) {
            return res.status(400).json({ message: "This order is already assigned to another rider." });
        }

        order.rider = riderId;
        order.deliveryStatus = "Out for Delivery";

        await order.save();
        res.json({ message: "Order assigned for delivery", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get all accepted orders for the logged-in rider
exports.getAcceptedOrders = async (req, res) => {
    try {
        const riderId = req.user.id; // Get rider ID from JWT token

        const orders = await Order.find({ rider: riderId, status: "Accepted" })
            .populate("user", "name email")
            .populate("bakery", "bakeryName email bakeryType")
            .populate("items");

        res.json(orders);
    } catch (error) {
        console.error("Error fetching accepted orders:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

exports.completeDelivery = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.rider.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not assigned to this order" });
        }

        order.deliveryStatus = "Delivered";
       
        await order.save();
        res.json({ message: "Delivery completed successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCustomizedAceptedOrder = async (req, res) => {
    try {
        const riderId = req.user.id; // Logged-in rider ka ID
  
        // Sirf woh orders jo iss rider ne accept kiye hain
        const orders = await CustomOrder.find({ rider: riderId, deliveryStatus: "Out for Delivery" })
            .populate("bakery", "bakeryName")
            .populate("user", "name email");
  
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching accepted orders." });
    }
  };
