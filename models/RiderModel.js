const mongoose = require("mongoose");

const RiderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  cnicNumber: { type: String, required: true, unique: true },  // ✅ Fix: Ensure cnicNumber is required & unique
  cnicImage: { type: String, required: true },
  licenseImage: { type: String, required: true },
  bikeDocsImage: { type: String, required: true },
  status: { type: String, default: "Pending" } // Pending | Approved
});

module.exports = mongoose.model("Rider", RiderSchema);
