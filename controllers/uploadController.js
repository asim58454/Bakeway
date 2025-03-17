const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// 🔹 Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Setup Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bakeway_uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed image types
    public_id: (req, file) => `bakeway_${Date.now()}_${file.originalname}`, // Unique filename
  },
});

// 🔹 File Upload Middleware
const upload = multer({ storage });

module.exports = upload;
