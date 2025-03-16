const express = require("express");
const { getOrders, updateOrderStatus, addMenuItem } = require("../controllers/bakeryController");
const upload = require("../controllers/uploadController");
const { protect, isBakery } = require("../middleware/authMiddleware");

// ✅ Import Custom Order Controller
const { getAvailableCustomOrders, acceptCustomOrder } = require("../controllers/customOrderController");

const router = express.Router();

router.get("/orders/:bakeryId", protect, isBakery, getOrders);
router.put("/order-status/:orderId", protect, isBakery, updateOrderStatus);
router.post("/menu", protect, isBakery, upload.single("image"), addMenuItem);

// ✅ Custom Order Routes
router.get("/custom-orders", protect, isBakery, getAvailableCustomOrders);
router.put("/custom-order/:orderId", protect, isBakery, acceptCustomOrder); // ✅ Fix: Accept Custom Order Route


module.exports = router;
