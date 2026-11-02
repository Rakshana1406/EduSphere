import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../auth/AuthContext";
import { useEnrollments } from "../context/EnrollmentContext";

function StudentDashboard() {
    const { user } = useAuth();
    const { enrollments, loading, error } = useEnrollments();

    const active = enrollments.filter((e) => e.status !== "completed");
    const completed = enrollments.filter((e) => e.status === "completed");

    return (
        <>
            <Navbar />
            <div className="dash-wrap">
                <h1>Welcome back, {user?.name}! 👋</h1>
                <p className="muted">
                    {user?.department} • {user?.email}
                </p>

                {loading && <p>Loading your courses...</p>}
                {error && <div className="alert-error">{error}</div>}

                <section>
                    <div className="section-head">
                        <h2>In Progress ({active.length})</h2>
                        <Link to="/courses">+ Browse More Courses</Link>
                    </div>
                    {active.length === 0 ? (
                        <div className="empty-box">
                            <p>You are not currently taking any active courses.</p>
                            <Link to="/courses">Explore Courses →</Link>
                        </div>
                    ) : (
                        <div className="grid-cards">
                            {active.map((e) => (
                                <div key={e.id} className="info-card">
                                    <span className="pill blue">In Progress</span>
                                    <h3>{e.course.courseName}</h3>
                                    <p className="muted">Instructor: {e.course.instructor}</p>
                                    <ProgressBar enrollment={e} />
                                    <Link className="btn-block" to={`/start-course?id=${e.id}`}>Continue Learning</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2>Completed Courses ({completed.length})</h2>
                    {completed.length === 0 ? (
                        <div className="empty-box"><p>No completed courses yet. Finish a course to earn your certificate!</p></div>
                    ) : (
                        <div className="grid-cards">
                            {completed.map((e) => (
                                <div key={e.id} className="info-card">
                                    <span className="pill green">Completed 🎉</span>
                                    <h3>{e.course.courseName}</h3>
                                    <p className="muted">Instructor: {e.course.instructor}</p>
                                    <ProgressBar enrollment={e} />
                                    <Link className="btn-block green" to={`/certificate?id=${e.id}`}>🎓 View Certificate</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

export default StudentDashboard;
