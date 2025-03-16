const express = require("express");
const { getPendingBakeries, approveBakery, getOrderHistory } = require("../controllers/adminController"); // getOrderHistory ko Import Karo
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/pending", protect, isAdmin, getPendingBakeries); // Pending Bakeries Route
router.put("/approve/:id", protect, isAdmin, approveBakery); // Bakery Approve Route
router.get("/orders", protect, isAdmin, getOrderHistory); // 🔥 Yeh Route Add Karo for Order History

module.exports = router;
