const express = require("express");
const { createOrder, getApprovedBakeries, getBakeryMenu, getUserOrders } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/approved-bakeries", protect, getApprovedBakeries);
router.get("/menu/:bakeryId", protect, getBakeryMenu);
router.post("/order/:bakeryId", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);

module.exports = router;
