const Order = require("../models/OrderModel");
const Bakery = require("../models/BakeryModel");

// ✅ Get Approved Bakeries (Only Approved ones)
exports.getApprovedBakeries = async (req, res) => {
  try {
    const bakeries = await Bakery.find({ status: "Approved" })
      .select("bakeryName bakeryType menu"); // 🛠 Added bakeryType

    res.status(200).json(bakeries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bakeries", error: error.message });
  }
};


// ✅ Get Bakery Menu
exports.getBakeryMenu = async (req, res) => {
  try {
    const bakery = await Bakery.findById(req.params.bakeryId).select("menu");

    if (!bakery) {
      return res.status(404).json({ message: "Bakery Not Found" });
    }

    res.status(200).json(bakery.menu);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu", error: error.message });
  }
};

// ✅ Place Order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const bakery = await Bakery.findById(req.params.bakeryId);

    if (!bakery) {
      return res.status(404).json({ message: "Bakery Not Found" });
    }

    const order = await Order.create({
      user: req.user.id, // JWT se User ID
      bakery: bakery._id,
      items,
      totalAmount,
      status: "Pending",
    });

    res.status(201).json({ message: "Order Placed Successfully", order });
  } catch (error) {
    res.status(400).json({ message: "Order Not Created", error: error.message });
  }
};

// ✅ Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("bakery", "bakeryName bakeryType") // ✅ bakeryType add kiya
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};
