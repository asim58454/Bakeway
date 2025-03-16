const multer = require("multer");
const path = require("path");

// Uploads folder ka path
const uploadDir = path.join(__dirname, "../uploads");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Files uploads folder me save hongi
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File Upload Middleware
const upload = multer({ storage: storage });

module.exports = upload;
