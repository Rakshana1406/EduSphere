const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");
const { notifyUser, notifyRole } = require("../services/notificationService");
const httpError = require("../utils/httpError");

const isId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /enrollments   { courseId }   (student)
async function enrollCourse(req, res) {
  const { courseId } = req.body || {};
  if (!courseId || !isId(courseId)) throw httpError(400, "A valid courseId is required");

  const course = await Course.findById(courseId);
  if (!course) throw httpError(404, "Course not found");

  const studentId = req.user.sub;
  if (await Enrollment.exists({ student: studentId, course: courseId })) {
    throw httpError(409, "Already enrolled in this course");
  }

  const enrollment = await Enrollment.create({ student: studentId, course: courseId });
  const io = req.app.get("io");
  const student = await User.findById(studentId).select("name");

  await notifyUser(io, studentId, {
    message: `You enrolled in ${course.courseName}`,
    type: "enrollment",
  });
  await notifyRole(io, "admin", {
    message: `${student?.name || "A student"} enrolled in ${course.courseName}`,
    type: "enrollment",
  });

  res.status(201).json({
    success: true,
    message: "Course enrollment successful",
    data: { ...enrollment.toJSON(), course: course.toJSON() },
  });
}

// GET /enrollments/my   (student)
async function myEnrollments(req, res) {
  const list = await Enrollment.find({ student: req.user.sub }).populate("course").sort({ enrolledAt: -1 });
  res.json({ success: true, count: list.length, data: list.filter((e) => e.course).map((e) => e.toJSON()) });
}

// GET /enrollments   (admin)
async function allEnrollments(req, res) {
  const list = await Enrollment.find()
    .populate("course", "courseName courseCode")
    .populate("student", "name email department")
    .sort({ enrolledAt: -1 });
  res.json({ success: true, count: list.length, data: list.map((e) => e.toJSON()) });
}

// DELETE /enrollments/:id   (student drops own enrollment, admin can remove any)
async function dropEnrollment(req, res) {
  if (!isId(req.params.id)) throw httpError(400, "Invalid id format");
  const filter = { _id: req.params.id };
  if (req.user.role !== "admin") filter.student = req.user.sub;
  const deleted = await Enrollment.findOneAndDelete(filter);
  if (!deleted) throw httpError(404, "Enrollment not found");
  res.json({ success: true, message: "Enrollment removed" });
}

// PATCH /enrollments/:id/modules/:index/complete   (student)
// Modules unlock in order. Finishing the last one completes the course (certificate unlocked).
async function completeModule(req, res) {
  if (!isId(req.params.id)) throw httpError(400, "Invalid id format");

  const enrollment = await Enrollment.findOne({ _id: req.params.id, student: req.user.sub }).populate("course");
  if (!enrollment || !enrollment.course) throw httpError(404, "Enrollment not found");

  const total = enrollment.course.modules.length;
  const index = Number(req.params.index);
  if (!Number.isInteger(index) || index < 0 || index >= total) throw httpError(400, "Invalid module");

  const done = enrollment.completedModules;
  if (!done.includes(index)) {
    if (index !== done.length) throw httpError(400, "Complete the previous module first");
    done.push(index);
  }

  enrollment.progress = Math.round((done.length / total) * 100);
  const justFinished = done.length >= total && enrollment.status !== "completed";
  if (justFinished) {
    enrollment.status = "completed";
    enrollment.completedAt = new Date();
  }
  await enrollment.save();

  if (justFinished) {
    await notifyUser(req.app.get("io"), req.user.sub, {
      message: `Congratulations! You completed ${enrollment.course.courseName}. Your certificate is ready.`,
      type: "enrollment",
    });
  }
  res.json({ success: true, data: enrollment.toJSON() });
}

module.exports = { enrollCourse, myEnrollments, allEnrollments, dropEnrollment, completeModule };
