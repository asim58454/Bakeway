const User = require("../models/UserModel");
const Bakery = require("../models/BakeryModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, type, bakeryType } = req.body;

    if (!name || !email || !password || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser =
      (await User.findOne({ email })) || (await Bakery.findOne({ email }));
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (type === "User") {
      newUser = await User.create({ name, email, password: hashedPassword });
    } else if (type === "Bakery") {
      if (!bakeryType) {
        return res.status(400).json({ message: "Bakery type is required" });
      }

      newUser = await Bakery.create({
        bakeryName: name,
        email,
        password: hashedPassword,
        status: "Pending", // Bakery ka default status "Pending" hoga
        bakeryType, // Local ya Home-based
      });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    res
      .status(201)
      .json({ message: "Registration successful", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user;

    // Admin Login
    if (type === "Admin") {
      if (email === "bakewayadmin@gmail.com" && password === "87654321") {
        const admin = await User.findOne({ email });
        if (admin) {
          user = { _id: admin._id, email, type: "Admin" };

          // Fetch pending bakeries with their type (Local/Home-based)
          const pendingBakeries = await Bakery.find({ status: "Pending" }).select(
            "bakeryName email bakeryType"
          );

          return res.status(200).json({
            message: "Admin login successful",
            token: jwt.sign(
              { id: admin._id, email, type: "Admin" },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            ),
            id: admin._id,
            pendingBakeries, // Admin will get a list of pending bakeries with their type
          });
        }
      } else {
        return res.status(400).json({ message: "Invalid Admin Credentials" });
      }
    } else if (type === "User") {
      user = await User.findOne({ email });
    } else if (type === "Bakery") {
      user = await Bakery.findOne({ email });

      if (user && user.status === "Pending") {
        return res
          .status(403)
          .json({ message: "Your registration is pending approval." });
      }
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    if (type !== "Admin") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Password" });
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, type: type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("JWT Token:", token);

    res.status(200).json({
      message: "Login successful",
      token,
      id: user._id,
    });
  } catch (error) {
    console.log("Login Error:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
