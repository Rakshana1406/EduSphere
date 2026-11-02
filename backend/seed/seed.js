// Usage:  npm run seed
// Loads sample courses and creates a default admin (from .env) if missing.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Course = require("../models/Course");
const User = require("../models/User");
const courses = require("./courses");

async function run() {
  await connectDB();

  for (const { id, modules, ...course } of courses) {
    await Course.updateOne(
      { courseCode: course.courseCode.toUpperCase() },
      { $setOnInsert: course, $set: { modules } }, // modules are always refreshed (3 per course)
      { upsert: true }
    );
  }
  console.log(`Courses ready: ${await Course.countDocuments()}`);

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  if (!(await User.exists({ email }))) {
    await User.create({
      name: "Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "admin",
      department: "Academic Operations",
    });
    console.log(`Admin created -> ${email}`);
  } else {
    console.log(`Admin already exists -> ${email}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
