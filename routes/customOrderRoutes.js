const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const customOrderController = require("../controllers/customOrderController");

// ✅ Submit Custom Order (User)
router.post("/users/custom-order", protect, customOrderController.createCustomOrder);

// ✅ Get Available Custom Orders (Bakery)
router.get("/available-custom-orders", protect, customOrderController.getAvailableCustomOrders);

// ✅ Accept Custom Order (Bakery)
router.put("/accept-custom-order/:orderId", protect, customOrderController.acceptCustomOrder);

// ✅ Get User Custom Orders (Order History)
router.get("/user/custom-orders", protect, customOrderController.getUserCustomOrders);

// ✅ Get All Custom Orders (Admin)
router.get("/admin/custom-orders", protect, customOrderController.getAdminCustomOrders);

module.exports = router;
