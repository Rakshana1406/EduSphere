const mongoose = require("mongoose");
const toJSONOptions = require("../utils/toJSON");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ["info", "course", "enrollment"], default: "info" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

module.exports = mongoose.model("Notification", notificationSchema);
