const express = require("express");
const { registerRider, loginRider } = require("../controllers/riderAuthController");
const { getPendingOrdersForRider, acceptOrderForDelivery, completeDelivery, getAcceptedOrders, getCustomizedAceptedOrder } = require("../controllers/riderController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { getPendingRiders, approveRider } = require("../controllers/adminController");
const upload = require("../controllers/uploadController");
const { getPendingCustomizedOrdersForRider, acceptCustomizedOrderForDelivery, completeCustomizedOrderDelivery } = require("../controllers/riderController");

const router = express.Router();

// 📝 Rider Registration & Login
router.post(
  "/register",
  upload.fields([{ name: "cnicImage" }, { name: "licenseImage" }, { name: "bikeDocsImage" }]),
  registerRider
);
router.post("/login", loginRider);

// 🛵 Admin Panel - Approving Riders
router.get("/pending", protect, isAdmin, getPendingRiders);
router.put("/approve/:id", protect, isAdmin, approveRider);

// 📦 Rider Order Management
router.get("/orders/pending", protect, getPendingOrdersForRider); // Get all available orders
router.put("/orders/accept/:orderId", protect, acceptOrderForDelivery); // Accept an order for delivery
router.put("/orders/complete/:orderId", protect, completeDelivery); // Mark order as delivered

router.get("/orders/accepted", protect, getAcceptedOrders);

router.get("/orders/customized/pending", protect, getPendingCustomizedOrdersForRider);

router.put("/orders/customized/accept/:orderId", protect, acceptCustomizedOrderForDelivery);
router.put("/orders/customized/complete/:orderId", protect, completeCustomizedOrderDelivery);


router.get("/orders/customized/accepted", protect, getCustomizedAceptedOrder);



module.exports = router;
