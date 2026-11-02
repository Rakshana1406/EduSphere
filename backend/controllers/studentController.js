const mongoose = require("mongoose");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const httpError = require("../utils/httpError");

const EDITABLE = ["name", "department", "phone", "gradYear"];

function assertAccess(req) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw httpError(400, "Invalid id format");
  if (req.user.role !== "admin" && req.user.sub !== req.params.id) {
    throw httpError(403, "Access denied. Insufficient permissions.");
  }
}

// GET /students   (admin)
async function getStudents(req, res) {
  const students = await User.find({ role: "student" }).sort({ createdAt: -1 });
  res.json({ success: true, count: students.length, data: students });
}

// GET /students/:id   (admin or the student themself)
async function getStudent(req, res) {
  assertAccess(req);
  const student = await User.findById(req.params.id);
  if (!student) throw httpError(404, "Student not found");
  res.json({ success: true, data: student });
}

// PUT /students/:id   (admin or the student themself)
async function updateStudent(req, res) {
  assertAccess(req);
  const updates = {};
  for (const key of EDITABLE) if (req.body[key] !== undefined) updates[key] = req.body[key];
  const student = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!student) throw httpError(404, "Student not found");
  res.json({ success: true, message: "Student updated successfully", data: student });
}

// DELETE /students/:id   (admin)
async function deleteStudent(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw httpError(400, "Invalid id format");
  const student = await User.findOneAndDelete({ _id: req.params.id, role: "student" });
  if (!student) throw httpError(404, "Student not found");
  await Enrollment.deleteMany({ student: student._id });
  res.json({ success: true, message: "Student deleted successfully" });
}

module.exports = { getStudents, getStudent, updateStudent, deleteStudent };
