const courseService = require("../services/courseService");
const { notifyRole } = require("../services/notificationService");
const httpError = require("../utils/httpError");

const getCourses = async (req, res) => {
  const courses = await courseService.getAllCourses();
  res.status(200).json({ success: true, count: courses.length, data: courses });
};

const getCourse = async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  if (!course) throw httpError(404, "Course not found");
  res.status(200).json({ success: true, data: course });
};

const addCourse = async (req, res) => {
  const course = await courseService.createCourse(req.body);
  // Real-time: tell every student a new course is available
  await notifyRole(req.app.get("io"), "student", {
    message: `New course available: ${course.courseName}`,
    type: "course",
  });
  res.status(201).json({ success: true, message: "Course created successfully", data: course });
};

const editCourse = async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  if (!course) throw httpError(404, "Course not found");
  res.status(200).json({ success: true, message: "Course updated successfully", data: course });
};

const removeCourse = async (req, res) => {
  const course = await courseService.deleteCourse(req.params.id);
  if (!course) throw httpError(404, "Course not found");
  res.status(200).json({ success: true, message: "Course deleted successfully" });
};

module.exports = { getCourses, getCourse, addCourse, editCourse, removeCourse };
