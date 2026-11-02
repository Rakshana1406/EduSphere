const mongoose = require("mongoose");
const toJSONOptions = require("../utils/toJSON");

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Module title is required"], trim: true },
    videoUrl: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: [true, "Course name is required"], trim: true },
    courseCode: { type: String, required: [true, "Course code is required"], unique: true, trim: true, uppercase: true },
    instructor: { type: String, required: [true, "Instructor is required"], trim: true },
    duration: { type: String, required: [true, "Duration is required"], trim: true },
    category: { type: String, required: [true, "Category is required"], trim: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    image: { type: String, trim: true },
    overview: { type: String, trim: true },
    learningOutcomes: [{ type: String }],
    modules: [moduleSchema],
  },
  { timestamps: true, toJSON: toJSONOptions }
);

const Course = mongoose.model("Course", courseSchema);

// Automatic one-time migration: older courses stored modules as plain strings.
// Runs when the DB connection opens and rewrites them as { title, videoUrl }.
mongoose.connection.once("open", async () => {
  try {
    const legacy = await Course.collection.find({ modules: { $type: "string" } }).project({ modules: 1 }).toArray();
    for (const doc of legacy) {
      const modules = doc.modules.map((m) => (typeof m === "string" ? { title: m, videoUrl: "" } : m));
      await Course.collection.updateOne({ _id: doc._id }, { $set: { modules } });
    }
    if (legacy.length) console.log(`Migrated modules of ${legacy.length} course(s) to the video format`);
  } catch (err) {
    console.error("Module migration skipped:", err.message);
  }
});

module.exports = Course;
