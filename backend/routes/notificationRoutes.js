const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const c = require("../controllers/notificationController");

const router = express.Router();
router.use(authenticateToken);

router.get("/", c.listNotifications);
router.patch("/read-all", c.markAllRead);
router.patch("/:id/read", c.markRead);

module.exports = router;
