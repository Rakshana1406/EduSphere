const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const httpError = require("../utils/httpError");

async function listNotifications(req, res) {
  const list = await Notification.find({ user: req.user.sub }).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, count: list.length, data: list });
}

async function markRead(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw httpError(400, "Invalid id format");
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.sub },
    { read: true },
    { new: true }
  );
  if (!n) throw httpError(404, "Notification not found");
  res.json({ success: true, data: n });
}

async function markAllRead(req, res) {
  await Notification.updateMany({ user: req.user.sub, read: false }, { read: true });
  res.json({ success: true, message: "All notifications marked as read" });
}

module.exports = { listNotifications, markRead, markAllRead };
