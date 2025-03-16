const jwt = require("jsonwebtoken");
const Bakery = require("../models/BakeryModel"); 
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // ✅ Yeh line console pe token ka data dikhayegi
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token Error:", err.message); // 🛑 Token Error ko catch kar ke dikhayega
    res.status(401).json({ message: "Invalid Token" });
  }
};

exports.isBakery = async (req, res, next) => {
  const bakery = await Bakery.findById(req.user.id);
  if (!bakery) {
    return res.status(403).json({ message: "Access Denied. Bakery Only" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  console.log("User Email:", req.user.email); // 🧐 Check karo ke email aa raha hai ya nahi
  console.log("User Type:", req.user.type);   // 🧐 Check karo ke type aa raha hai ya nahi

  if (req.user.email === "bakewayadmin@gmail.com" && req.user.type === "Admin") {
    console.log("✅ Admin Verified");
    next();
  } else {
    console.log("❌ Access Denied");
    res.status(403).json({ message: "Access Denied. Admin Only" });
  }
};

exports.isRiderApproved = (req, res, next) => {
  if (req.user.status !== "Approved") {
    return res.status(403).json({ message: "Your registration is pending approval." });
  }
  next();
};

