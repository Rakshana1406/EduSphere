const Notification = require("../models/Notification");
const User = require("../models/User");

// Save a notification and push it to the user's socket room instantly.
async function notifyUser(io, userId, { message, type = "info" }) {
  const notification = await Notification.create({ user: userId, message, type });
  if (io) io.to(`user:${userId}`).emit("notification", notification.toJSON());
  return notification;
}

async function notifyRole(io, role, { message, type = "info" }) {
  const users = await User.find({ role }).select("_id");
  if (!users.length) return [];
  const docs = await Notification.insertMany(users.map((u) => ({ user: u._id, message, type })));
  if (io) docs.forEach((d) => io.to(`user:${d.user}`).emit("notification", d.toJSON()));
  return docs;
}

module.exports = { notifyUser, notifyRole };
