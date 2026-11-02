const mongoose = require("mongoose");
const toJSONOptions = require("../utils/toJSON");

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    enrolledAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    completedModules: { type: [Number], default: [] }, // indexes of finished modules, in order
    progress: { type: Number, min: 0, max: 100, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

// A student can enroll in a course only once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
