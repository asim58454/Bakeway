const Rider = require("../models/RiderModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

// ✅ Rider Registration with Cloudinary Upload
exports.registerRider = async (req, res) => {
  try {
    const { name, email, phone, password, cnicNumber } = req.body;

    // ✅ Check if all fields are filled
    if (!name || !email || !phone || !password || !cnicNumber || !req.files) {
      return res.status(400).json({ message: "All fields and documents are required!" });
    }

    // ✅ Check if CNIC already exists
    const existingRider = await Rider.findOne({ cnicNumber });
    if (existingRider) {
      return res.status(400).json({ message: "CNIC Number already in use. Please enter a unique CNIC." });
    }

    // ✅ Upload images to Cloudinary
    const uploadImage = async (file) => {
      const result = await cloudinary.uploader.upload(file.path, { folder: "riders" });
      return result.secure_url;
    };

    const cnicImage = req.files.cnicImage ? await uploadImage(req.files.cnicImage[0]) : null;
    const licenseImage = req.files.licenseImage ? await uploadImage(req.files.licenseImage[0]) : null;
    const bikeDocsImage = req.files.bikeDocsImage ? await uploadImage(req.files.bikeDocsImage[0]) : null;

    if (!cnicImage || !licenseImage || !bikeDocsImage) {
      return res.status(400).json({ message: "All documents must be uploaded!" });
    }

    // ✅ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create New Rider
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
      riderId: newRider._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Rider Login
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
