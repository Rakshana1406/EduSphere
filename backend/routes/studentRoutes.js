const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const c = require("../controllers/studentController");

const router = express.Router();
router.use(authenticateToken);

router.get("/", authorizeRoles("admin"), c.getStudents);
router.get("/:id", c.getStudent);
router.put("/:id", c.updateStudent);
router.delete("/:id", authorizeRoles("admin"), c.deleteStudent);

module.exports = router;
