const Bakery = require("../models/BakeryModel");
const Order = require("../models/OrderModel");
const Rider = require("../models/RiderModel");

exports.getPendingBakeries = async (req, res) => {
  try {
    const bakeries = await Bakery.find({ status: "Pending" }).select("bakeryName email bakeryType status"); // ✅ Now status will show
    res.json(bakeries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending bakeries", error: error.message });
  }
};



exports.approveBakery = async (req, res) => {
  try {
    const bakery = await Bakery.findById(req.params.id);
    if (!bakery) {
      return res.status(404).json({ message: "Bakery not found" });
    }
    bakery.status = "Approved";
    await bakery.save();
    res.json(bakery);
  } catch (error) {
    res.status(500).json({ message: "Error approving bakery", error: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name") 
      .populate("bakery", "bakeryName bakeryType") // ✅ Bakery Type Show Karega
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order history", error: error.message });
  }
};


exports.getPendingRiders = async (req, res) => {
  try {
    const pendingRiders = await Rider.find({ status: "Pending" }).select(
      "name email phone cnicNumber cnicImage licenseImage bikeDocsImage status"
    );

    res.json(pendingRiders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.approveRider = async (req, res) => {
  try {
    const { id } = req.params;
    const rider = await Rider.findById(id);

    if (!rider) return res.status(404).json({ message: "Rider not found" });

    rider.status = "Approved";
    await rider.save();

    res.json({ message: "Rider approved successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
