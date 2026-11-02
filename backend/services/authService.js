const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const httpError = require("../utils/httpError");
const { sendMail } = require("../utils/mailer");

const RESET_MINUTES = 15;
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

async function registerUser(body) {
  const { name, email, password, department, role = "student", adminKey } = body;

  if (role === "admin") {
    if (!process.env.ADMIN_REGISTRATION_KEY || adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
      throw httpError(403, "Invalid admin registration key");
    }
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    throw httpError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    department: department.trim(),
    role,
    phone: body.phone,
    gradYear: body.gradYear ? Number(body.gradYear) : undefined,
    employeeId: body.employeeId,
    designation: body.designation,
    officePhone: body.officePhone,
  });
  return user.toJSON();
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw httpError(401, "Invalid email or password");
  }
  return user.toJSON();
}

// Creates a one-time token (valid 15 min), stores only its hash, emails the link.
async function requestPasswordReset(email) {
  const user = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (!user) return; // silently do nothing (no user enumeration)

  const token = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = hashToken(token);
  user.passwordResetExpires = new Date(Date.now() + RESET_MINUTES * 60 * 1000);
  await user.save();

  const base = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim().replace(/\/$/, "");
  const link = `${base}/reset-password/${token}`;

  // Not awaited: the response time must not reveal whether the email exists.
  sendMail({
    to: user.email,
    subject: "Reset your EduSphere password",
    text: `Hi ${user.name},\n\nUse this link to reset your password (valid for ${RESET_MINUTES} minutes):\n${link}\n\nIf you did not ask for this, you can ignore this email.`,
    html: `<p>Hi ${escapeHtml(user.name)},</p><p>Use the button below to reset your password. The link is valid for ${RESET_MINUTES} minutes.</p><p><a href="${link}" style="background:#2563eb;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Reset password</a></p><p>Or copy this link: ${link}</p><p>If you did not ask for this, you can ignore this email.</p>`,
  }).catch((err) => console.error("Could not send reset email:", err.message));
}

async function resetPassword(token, newPassword) {
  const user = await User.findOne({
    passwordResetToken: hashToken(String(token)),
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordHash +passwordResetToken +passwordResetExpires");

  if (!user) throw httpError(400, "This reset link is invalid or has expired. Please request a new one.");

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

module.exports = { registerUser, loginUser, requestPasswordReset, resetPassword };
