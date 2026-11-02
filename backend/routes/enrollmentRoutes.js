const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const c = require("../controllers/enrollmentController");

const router = express.Router();
router.use(authenticateToken);

router.post("/", authorizeRoles("student"), c.enrollCourse);
router.get("/my", authorizeRoles("student"), c.myEnrollments);
router.patch("/:id/modules/:index/complete", authorizeRoles("student"), c.completeModule);
router.get("/", authorizeRoles("admin"), c.allEnrollments);
router.delete("/:id", authorizeRoles("student", "admin"), c.dropEnrollment);

module.exports = router;
