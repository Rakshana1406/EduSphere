import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import { useEnrollments } from "../context/EnrollmentContext";
import { getErrorMessage } from "../services/api";

function MyCourses() {
    const { enrollments, loading, error, drop } = useEnrollments();

    async function handleDrop(id) {
        if (!window.confirm("Drop this course?")) return;
        try {
            await drop(id);
        } catch (err) {
            alert(getErrorMessage(err, "Unable to drop course."));
        }
    }

    return (
        <>
            <Navbar />
            <div className="dash-wrap narrow">
                <h2>My Enrolled Courses</h2>
                {loading && <p>Loading...</p>}
                {error && <div className="alert-error">{error}</div>}

                {!loading && enrollments.length === 0 ? (
                    <div className="empty-box">
                        <p>You have not enrolled in any courses yet.</p>
                        <Link to="/courses">Browse Available Courses →</Link>
                    </div>
                ) : (
                    <div className="stack">
                        {enrollments.map((e) => (
                            <div key={e.id} className="info-card">
                                <span className={`pill ${e.status === "completed" ? "green" : "blue"}`}>
                                    {e.status === "completed" ? "Completed" : "Enrolled"}
                                </span>
                                <h3>{e.course.courseName}</h3>
                                <p className="muted">Instructor: {e.course.instructor}</p>
                                    <ProgressBar enrollment={e} />
                                <p className="muted">Duration: {e.course.duration}</p>
                                <div className="row">
                                    <Link className="btn-block" to={`/start-course?id=${e.id}`}>
                                        {e.status === "completed" ? "Review" : "Start Course"}
                                    </Link>
                                    <button className="delete-btn" onClick={() => handleDrop(e.id)}>Drop</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default MyCourses;
