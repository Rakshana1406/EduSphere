const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const c = require("../controllers/messageController");

const router = express.Router();
router.use(authenticateToken);

router.get("/contacts", c.contacts);
router.get("/:userId", c.conversation);

module.exports = router;
