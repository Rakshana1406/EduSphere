const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../middleware/authValidation");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Slow down brute-force attempts on login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

router.post("/register", authLimiter, validateRegistration, authController.register);
router.post("/login", authLimiter, validateLogin, authController.login);
router.get("/me", authenticateToken, authController.me);

// Stricter limit: max 10 reset requests / 15 min per IP
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many reset attempts. Please try again later." },
});
router.post("/forgot-password", resetLimiter, validateForgotPassword, authController.forgotPassword);
router.post("/reset-password/:token", resetLimiter, validateResetPassword, authController.resetPassword);

module.exports = router;
