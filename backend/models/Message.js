const mongoose = require("mongoose");
const toJSONOptions = require("../utils/toJSON");

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

messageSchema.index({ from: 1, to: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
