const jwt = require("jsonwebtoken");
const authService = require("../services/authService");
const User = require("../models/User");
const httpError = require("../utils/httpError");

async function register(req, res) {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, message: "Registered successfully", student: user });
}

async function login(req, res) {
  const user = await authService.loginUser(req.body);
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");

  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { subject: user.id, expiresIn }
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    tokenType: "Bearer",
    expiresIn,
    student: user,
  });
}

async function me(req, res) {
  const user = await User.findById(req.user.sub);
  if (!user) throw httpError(404, "User not found");
  res.json({ success: true, data: user });
}

// Always the same answer, so nobody can find out which emails are registered.
const GENERIC_RESET_MESSAGE = "If that email is registered, a password reset link has been sent.";

async function forgotPassword(req, res) {
  await authService.requestPasswordReset(req.body.email);
  res.json({ success: true, message: GENERIC_RESET_MESSAGE });
}

async function resetPassword(req, res) {
  await authService.resetPassword(req.params.token, req.body.password);
  res.json({ success: true, message: "Password reset successful. You can now log in." });
}

module.exports = { register, login, me, forgotPassword, resetPassword };
