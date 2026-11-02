const mongoose = require("mongoose");
const toJSONOptions = require("../utils/toJSON");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid"],
    },
    passwordHash: { type: String, required: true, select: false },
    passwordResetToken: { type: String, select: false }, // SHA-256 hash of the emailed token
    passwordResetExpires: { type: Date, select: false },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    department: { type: String, trim: true },
    phone: { type: String, trim: true },
    gradYear: { type: Number },
    employeeId: { type: String, trim: true },
    designation: { type: String, trim: true },
    officePhone: { type: String, trim: true },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

module.exports = mongoose.model("User", userSchema);
