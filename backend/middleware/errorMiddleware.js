// Centralized error handler. Controllers just `throw` or call next(err).
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError" && err.errors) {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for: ${Object.keys(err.keyValue || {}).join(", ") || "field"}`;
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid id format";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Malformed JSON in request body";
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    status = 401;
    message = "Invalid or expired token";
  }

  if (status >= 500) {
    console.error(err.stack || err);
    if (process.env.NODE_ENV === "production") message = "Internal Server Error";
  }

  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
