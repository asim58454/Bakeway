const Bakery = require("../models/BakeryModel");
const Order = require("../models/OrderModel");
const cloudinary = require("../config/cloudinaryConfig");

// ✅ Add Bakery Menu Item (With Image)
exports.addMenuItem = async (req, res) => {
  try {
    const { name, price, image } = req.body; // Get Base64 Image from Frontend
    const bakery = await Bakery.findById(req.user.id); // Get Bakery ID from JWT

    if (!bakery) {
      return res.status(404).json({ message: "Bakery Not Found" });
    }

    let imageUrl = "";
    if (image) {
      // Upload Base64 Image to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: "menu_items",
      });
      imageUrl = result.secure_url;
    }

    const newItem = {
      name,
      price,
      image: imageUrl, // Save Cloudinary URL
    };

    bakery.menu.push(newItem);
    await bakery.save();

    res.status(201).json({ message: "Menu Item Added", menu: bakery.menu });
  } catch (error) {
    res.status(500).json({ message: "Error Adding Menu", error: error.message });
  }
};


// ✅ Get Orders by Bakery
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ bakery: req.params.bakeryId })
      .populate("user", "name")
      .sort({ createdAt: -1 }); // Latest orders first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Update Order Status (Accept/Reject)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    order.status = status; // Accept or Reject
    if (status === "Accepted") {
      order.deliveryStatus = "Ready for Delivery"; // 🛵 Now Riders Can See This Order
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Order Not Updated", error: error.message });
  }
};
