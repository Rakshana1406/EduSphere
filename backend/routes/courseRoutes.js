const express = require("express");
const { getCourses, getCourse, addCourse, editCourse, removeCourse } = require("../controllers/courseController");
const validateCourse = require("../middleware/courseValidation");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Public: anyone can browse courses
router.get("/", getCourses);
router.get("/:id", getCourse);

// Protected: login + admin role
router.post("/", authenticateToken, authorizeRoles("admin"), validateCourse, addCourse);
router.put("/:id", authenticateToken, authorizeRoles("admin"), validateCourse, editCourse);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), removeCourse);

module.exports = router;
