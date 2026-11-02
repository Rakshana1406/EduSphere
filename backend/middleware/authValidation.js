const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s\-()]{6,18}$/;

function validateRegistration(req, res, next) {
  const { name, email, password, department, phone, role } = req.body || {};
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof department !== "string"
  ) {
    return res.status(400).json({ success: false, message: "Name, email, password, and department are required" });
  }
  if (!name.trim() || !department.trim() || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ success: false, message: "Enter a valid name, email, and department" });
  }
  if (password.length < 8 || password.length > 72) {
    return res.status(400).json({ success: false, message: "Password must be between 8 and 72 characters" });
  }
  if (phone !== undefined && phone !== "" && (typeof phone !== "string" || !PHONE_RE.test(phone.trim()))) {
    return res.status(400).json({ success: false, message: "Enter a valid phone number" });
  }
  if (role !== undefined && !["student", "admin"].includes(role)) {
    return res.status(400).json({ success: false, message: "Role must be student or admin" });
  }
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password ||
    password.length > 72
  ) {
    return res.status(400).json({ success: false, message: "A valid email and password are required" });
  }
  next();
}

function validateForgotPassword(req, res, next) {
  const { email } = req.body || {};
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ success: false, message: "Enter a valid email address" });
  }
  next();
}

function validateResetPassword(req, res, next) {
  const { password } = req.body || {};
  if (typeof password !== "string" || password.length < 8 || password.length > 72) {
    return res.status(400).json({ success: false, message: "Password must be between 8 and 72 characters" });
  }
  next();
}

module.exports = { validateRegistration, validateLogin, validateForgotPassword, validateResetPassword };
