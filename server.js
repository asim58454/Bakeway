require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/UserModel");
const bcrypt = require("bcryptjs");
const path = require("path");

////////const customOrderRoutes = require("./routes/customOrderRoutes");


connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 🛠️ Serve Static Folder (Fix Image Not Showing Issue)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bakers", require("./routes/bakeryRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


app.use("/api", require("./routes/customOrderRoutes"));
/////app.use("/api", customOrderRoutes);
app.use("/api/bakery", require("./routes/bakeryRoutes"));


app.use("/api/riders", require("./routes/riderRoutes"));


// Create Default Admin User
const createAdmin = async () => {
  const adminEmail = "bakewayadmin@gmail.com";
  const adminPassword = "87654321";

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = new User({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });
      await admin.save();
      console.log("Default Admin Created");
    } else {
      console.log("Admin Already Exists");
    }
  } catch (error) {
    console.log("Error Creating Admin:", error.message);
  }
};

createAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
