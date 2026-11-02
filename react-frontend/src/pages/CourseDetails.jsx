import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "../auth/AuthContext";
import { useEnrollments } from "../context/EnrollmentContext";

function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin, isStudent } = useAuth();
    const { enroll, isEnrolled } = useEnrollments();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        api.get(`/courses/${id}`)
            .then((res) => !cancelled && setCourse(res.data.data))
            .catch((err) => !cancelled && setError(getErrorMessage(err, "Course not found")))
            .finally(() => !cancelled && setLoading(false));
        return () => { cancelled = true; };
    }, [id]);

    async function handleEnroll() {
        try {
            await enroll(course.id);
            navigate("/enrollment-success");
        } catch (err) {
            setError(getErrorMessage(err, "Unable to enroll."));
        }
    }

    return (
        <>
            <Navbar />
            <div className="details-wrap">
                <Link to="/courses" className="back-link">← Back to Courses</Link>
                {loading && <p>Loading...</p>}
                {error && <div className="alert-error">{error}</div>}
                {course && (
                    <div className="details-card">
                        <img src={course.image || "https://placehold.co/300x180?text=Course"} alt={course.courseName} />
                        <div>
                            <h2>{course.courseName}</h2>
                            <p className="muted">{course.courseCode} • {course.category} • {course.level}</p>
                            <p><strong>Instructor:</strong> {course.instructor}</p>
                            <p><strong>Duration:</strong> {course.duration}</p>
                            <p>{course.overview}</p>

                            {course.learningOutcomes?.length > 0 && (
                                <>
                                    <h4>What you'll learn</h4>
                                    <ul>{course.learningOutcomes.map((o) => <li key={o}>{o}</li>)}</ul>
                                </>
                            )}
                            {course.modules?.length > 0 && (
                                <>
                                    <h4>Modules</h4>
                                    <ol>{course.modules.map((m, i) => <li key={i}>{typeof m === "string" ? m : m.title}</li>)}</ol>
                                </>
                            )}

                            {isStudent && (isEnrolled(course.id)
                                ? <Link to="/my-courses" className="enroll-btn">Go to My Courses</Link>
                                : <button className="enroll-btn" onClick={handleEnroll}>Enroll Now</button>)}
                            {isAdmin && <Link to={`/edit-course/${course.id}`} className="edit-btn">Edit Course</Link>}
                            {!isStudent && !isAdmin && <Link to="/login" className="enroll-btn">Login to enroll</Link>}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CourseDetails;
