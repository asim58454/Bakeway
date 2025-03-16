const Rider = require("../models/RiderModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerRider = async (req, res) => {
    try {
      const { name, email, phone, password, cnicNumber } = req.body;
      const cnicImage = req.files?.cnicImage?.[0]?.path;
      const licenseImage = req.files?.licenseImage?.[0]?.path;
      const bikeDocsImage = req.files?.bikeDocsImage?.[0]?.path;
  
      if (!name || !email || !phone || !password || !cnicNumber || !cnicImage || !licenseImage || !bikeDocsImage) {
        return res.status(400).json({ message: "All fields and documents are required!" });
      }
  
      // ✅ Check if CNIC already exists
      const existingRider = await Rider.findOne({ cnicNumber });
      if (existingRider) {
        return res.status(400).json({ message: "CNIC Number already in use. Please enter a unique CNIC." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newRider = new Rider({
        name,
        email,
        phone,
        password: hashedPassword,
        cnicNumber,
        cnicImage,
        licenseImage,
        bikeDocsImage,
        status: "Pending",
      });
  
      await newRider.save();
  
      res.status(201).json({
        message: "Registration submitted for approval!",
        riderId: newRider._id,  // ✅ Return the newly created rider's ID
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

exports.loginRider = async (req, res) => {
  try {
    const { email, password } = req.body;
    const rider = await Rider.findOne({ email });

    if (!rider) return res.status(404).json({ message: "Rider not found" });

    const isMatch = await bcrypt.compare(password, rider.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (rider.status !== "Approved") {
      return res.status(403).json({ message: "Your registration is pending approval." });
    }

    const token = jwt.sign({ id: rider._id, email: rider.email, status: rider.status }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, rider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
