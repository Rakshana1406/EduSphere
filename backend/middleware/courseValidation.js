function isHttpUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const validateCourse = (req, res, next) => {
  const { courseName, courseCode, instructor, duration, category } = req.body || {};
  const required = { courseName, courseCode, instructor, duration, category };
  const labels = {
    courseName: "Course name",
    courseCode: "Course code",
    instructor: "Instructor",
    duration: "Duration",
    category: "Category",
  };
  for (const [key, value] of Object.entries(required)) {
    if (typeof value !== "string" || !value.trim()) {
      return res.status(400).json({ success: false, message: `${labels[key]} is required` });
    }
  }
  const { image } = req.body;
  if (image !== undefined && image !== null && image !== "") {
    const okImage =
      typeof image === "string" &&
      image.length <= 85000 &&
      (isHttpUrl(image) || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image));
    if (!okImage) {
      return res.status(400).json({
        success: false,
        message: "Image must be an http(s) link or an uploaded PNG/JPG/WebP picture (small size)",
      });
    }
  }

  const { modules } = req.body;
  if (
    !Array.isArray(modules) ||
    modules.length !== 3 ||
    modules.some((m) => !m || typeof m.title !== "string" || !m.title.trim() || !isHttpUrl(m.videoUrl))
  ) {
    return res.status(400).json({
      success: false,
      message: "Exactly 3 modules are required, each with a title and a valid video link (https://...)",
    });
  }

  next();
};

module.exports = validateCourse;
