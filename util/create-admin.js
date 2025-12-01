const mongoose = require("mongoose");
const User = require("../models/user-model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://a02369406_db_user:Rx9Fajbm2cG7rHrI@cluster0.vdo8ykp.mongodb.net/mentor?appName=Cluster0";

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@mentor.com";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      existingAdmin.roles = ["admin", "user"];
      await existingAdmin.save();
      console.log("Admin user updated with admin role");
    } else {
      const admin = new User({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: adminPassword,
        roles: ["admin", "user"],
        courses: []
      });

      await admin.save();
      console.log("Admin user created successfully");
    }

    console.log("\nAdmin Credentials:");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin user:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();

