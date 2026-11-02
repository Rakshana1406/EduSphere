// Blocks NoSQL-operator injection such as { "email": { "$gt": "" } }
// and strips control characters from strings.
function hasDangerousKey(value) {
  if (Array.isArray(value)) return value.some(hasDangerousKey);
  if (value && typeof value === "object") {
    return Object.keys(value).some(
      (key) => key.startsWith("$") || key.includes(".") || hasDangerousKey(value[key])
    );
  }
  return false;
}

function clean(value) {
  if (typeof value === "string") return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)]));
  }
  return value;
}

function sanitizeInput(req, res, next) {
  if (hasDangerousKey(req.body) || hasDangerousKey(req.query)) {
    return res.status(400).json({ success: false, message: "Invalid characters in request" });
  }
  if (req.body) req.body = clean(req.body);
  next();
}

module.exports = sanitizeInput;
