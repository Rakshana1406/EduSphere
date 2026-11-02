import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import VideoPlayer from "../components/VideoPlayer";
import { useEnrollments } from "../context/EnrollmentContext";
import { getErrorMessage } from "../services/api";

function StartCourse() {
    const [searchParams] = useSearchParams();
    const enrollmentId = searchParams.get("id");
    const { enrollments, loading, completeModule } = useEnrollments();

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [replay, setReplay] = useState(null); // index of a finished module whose video is open again

    // `id` in the URL is the enrollment id; fall back to the first enrollment
    const enrollment = enrollments.find((e) => e.id === enrollmentId) || (enrollmentId ? null : enrollments[0]);
    const course = enrollment?.course;

    const modules = (course?.modules || []).map((m) => (typeof m === "string" ? { title: m, videoUrl: "" } : m));
    const done = enrollment?.completedModules || [];
    const allDone = modules.length > 0 && done.length >= modules.length;

    async function finishModule(index) {
        setBusy(true);
        setError("");
        try {
            await completeModule(enrollment.id, index);
        } catch (err) {
            setError(getErrorMessage(err, "Unable to complete this module."));
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="dash-wrap narrow">
                <Link to="/my-courses" className="back-link">← Back to My Courses</Link>

                {loading && <p>Loading...</p>}
                {!loading && !enrollment && <div className="alert-error">Course not found in your enrollments.</div>}

                {enrollment && (
                    <div className="info-card" style={{ marginTop: "1rem" }}>
                        <h1 style={{ marginTop: 0 }}>{course.courseName}</h1>
                        <p className="muted">Instructor: <strong>{course.instructor}</strong> | Duration: {course.duration}</p>
                        {course.overview && <p>{course.overview}</p>}

                        <ProgressBar enrollment={enrollment} />
                        {error && <div className="alert-error">{error}</div>}

                        <h3>Course Modules</h3>
                        <div className="module-list">
                            {modules.map((m, i) => {
                                const isDone = done.includes(i);
                                const isCurrent = !isDone && i === done.length;
                                return (
                                    <div key={i} className={`module-item ${isDone ? "done" : isCurrent ? "current" : "locked"}`}>
                                        <div className="module-top">
                                            <span className="module-icon">{isDone ? "✅" : isCurrent ? "▶️" : "🔒"}</span>
                                            <div>
                                                <strong>Module {i + 1}:</strong> {m.title}
                                                {isDone && <small className="module-state"> Completed</small>}
                                                {!isDone && !isCurrent && <small className="module-state"> Locked – finish the previous module first</small>}
                                            </div>
                                        </div>

                                        {isCurrent && (
                                            <div className="module-body">
                                                <VideoPlayer url={m.videoUrl} title={m.title} />
                                                <p className="muted">Watch the video, then mark this module as completed to unlock the next one.</p>
                                                <button className="enroll-btn" disabled={busy} onClick={() => finishModule(i)}>
                                                    {busy ? "Saving..." : `Mark Module ${i + 1} as Completed`}
                                                </button>
                                            </div>
                                        )}

                                        {isDone && (
                                            <div className="module-body">
                                                <button className="link-btn" onClick={() => setReplay(replay === i ? null : i)}>
                                                    {replay === i ? "Hide video" : "▶ Watch again"}
                                                </button>
                                                {replay === i && <VideoPlayer url={m.videoUrl} title={m.title} />}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {allDone ? (
                            <div className="cert-box">
                                <h3>🎉 You completed all {modules.length} modules!</h3>
                                <Link to={`/certificate?id=${enrollment.id}`} className="btn-block green">🎓 View Certificate</Link>
                            </div>
                        ) : (
                            <p className="muted">Complete all {modules.length} modules to unlock your certificate.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default StartCourse;
