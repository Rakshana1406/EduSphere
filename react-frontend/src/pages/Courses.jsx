import { useState } from "react";
import { Link } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import { useEnrollments } from "../context/EnrollmentContext";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../services/api";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar";

function Courses() {
    const { courses, loading, error, deleteCourse } = useCourses();
    const { isAdmin, isStudent } = useAuth();
    const { enroll, isEnrolled } = useEnrollments();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [level, setLevel] = useState("all");
    const [message, setMessage] = useState("");

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await deleteCourse(id);
        } catch (err) {
            setMessage(getErrorMessage(err, "Unable to delete course."));
        }
    }

    async function handleEnroll(id) {
        try {
            await enroll(id);
            setMessage("Enrolled successfully! Find it under My Courses.");
        } catch (err) {
            setMessage(getErrorMessage(err, "Unable to enroll."));
        }
    }

    const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))].sort();
    const filtersActive = search !== "" || category !== "all" || level !== "all";

    const visible = courses.filter(
        (c) =>
            `${c.courseName} ${c.category} ${c.instructor}`.toLowerCase().includes(search.toLowerCase()) &&
            (category === "all" || c.category === category) &&
            (level === "all" || c.level === level)
    );

    return (
        <>
            <Navbar />
            <div className="courses-container">
                <div className="courses-header">
                    <h1>Available Courses</h1>
                    {isAdmin && <Link to="/add-course" className="add-course-btn">+ Add New Course</Link>}
                </div>

                <div className="filter-bar">
                    <input className="search-input" placeholder="Search by name, category or instructor..."
                        value={search} onChange={(e) => setSearch(e.target.value)} />

                    <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
                        <option value="all">All categories</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select className="filter-select" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Filter by level">
                        <option value="all">All levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>

                    {filtersActive && (
                        <button className="link-btn" onClick={() => { setSearch(""); setCategory("all"); setLevel("all"); }}>
                            Clear
                        </button>
                    )}
                </div>

                {message && <div className="alert-info" onClick={() => setMessage("")}>{message}</div>}
                {loading && <div className="loading-message">Loading courses...</div>}
                {error && <div className="alert-error">{error}</div>}

                <div className="courses-grid">
                    {visible.map((course) => (
                        <div key={course.id} className="course-item-wrapper">
                            <CourseCard
                                id={course.id}
                                image={course.image}
                                title={course.courseName}
                                description={course.overview}
                                badge={course.level}
                            />
                            <div className="course-actions">
                                {isStudent && (
                                    isEnrolled(course.id)
                                        ? <span className="enrolled-tag">✔ Enrolled</span>
                                        : <button className="enroll-btn" onClick={() => handleEnroll(course.id)}>Enroll</button>
                                )}
                                {isAdmin && (
                                    <>
                                        <Link to={`/edit-course/${course.id}`} className="edit-btn">Edit</Link>
                                        <button onClick={() => handleDelete(course.id)} className="delete-btn">Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {!loading && !error && visible.length === 0 && <p className="muted center">No courses found.</p>}
            </div>
        </>
    );
}

export default Courses;
