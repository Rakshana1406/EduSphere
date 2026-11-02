const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");
const httpError = require("../utils/httpError");

// GET /messages/contacts  -> everyone else you can chat with
async function contacts(req, res) {
  const users = await User.find({ _id: { $ne: req.user.sub } }).select("name email role").sort({ name: 1 });
  res.json({ success: true, data: users });
}

// GET /messages/:userId  -> conversation history with that user
async function conversation(req, res) {
  const other = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(other)) throw httpError(400, "Invalid id format");
  const me = req.user.sub;
  const list = await Message.find({
    $or: [
      { from: me, to: other },
      { from: other, to: me },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(200);
  res.json({ success: true, data: list });
}

module.exports = { contacts, conversation };
