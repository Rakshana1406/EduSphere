const Course = require("../models/Course");

const getAllCourses = () => Course.find().sort({ createdAt: 1 });
const getCourseById = (id) => Course.findById(id);
const createCourse = (data) => Course.create(data);
const updateCourse = (id, data) => {
  const { id: _ignoreId, _id, ...rest } = data || {};
  return Course.findByIdAndUpdate(id, rest, { new: true, runValidators: true });
};
const deleteCourse = (id) => Course.findByIdAndDelete(id);

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
