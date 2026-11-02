const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authentication token is required" });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: "JWT configuration is missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    // payload: { id, email, role, sub, iat, exp }
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// Works with both import styles:
//   const authenticateToken = require("./authMiddleware");
//   const { authenticateToken } = require("./authMiddleware");
module.exports = authenticateToken;
module.exports.authenticateToken = authenticateToken;
