import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getErrorMessage } from "../services/api";
import { useCourses } from "../context/CourseContext";

function AdminDashboard() {
    const { courses } = useCourses();
    const [students, setStudents] = useState([]);
    const [enrollmentCount, setEnrollmentCount] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        Promise.all([api.get("/students"), api.get("/enrollments")])
            .then(([s, e]) => {
                if (cancelled) return;
                setStudents(s.data.data);
                setEnrollmentCount(e.data.count);
            })
            .catch((err) => !cancelled && setError(getErrorMessage(err, "Unable to load dashboard data.")));
        return () => { cancelled = true; };
    }, []);

    async function removeStudent(id) {
        if (!window.confirm("Delete this student and their enrollments?")) return;
        try {
            await api.delete(`/students/${id}`);
            setStudents((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            setError(getErrorMessage(err, "Unable to delete student."));
        }
    }

    return (
        <>
            <Navbar />
            <div className="dash-wrap">
                <h2>Admin Dashboard</h2>
                {error && <div className="alert-error">{error}</div>}

                <div className="grid-cards">
                    <div className="info-card stat"><h4>Total Courses</h4><p className="stat-num blue">{courses.length}</p></div>
                    <div className="info-card stat"><h4>Total Students</h4><p className="stat-num green">{students.length}</p></div>
                    <div className="info-card stat"><h4>Total Enrollments</h4><p className="stat-num purple">{enrollmentCount}</p></div>
                </div>

                <div className="row" style={{ margin: "1.5rem 0" }}>
                    <Link to="/add-course" className="btn-block">+ Add Course</Link>
                    <Link to="/courses" className="btn-block gray">Manage Courses</Link>
                    <Link to="/manage-enrollment" className="btn-block gray">View Enrollments</Link>
                </div>

                <div className="info-card">
                    <h3>Registered Students</h3>
                    {students.length === 0 ? (
                        <p className="muted">No registered students found yet.</p>
                    ) : (
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr><th>#</th><th>Name</th><th>Email</th><th>Department</th><th /></tr>
                                </thead>
                                <tbody>
                                    {students.map((s, i) => (
                                        <tr key={s.id}>
                                            <td>{i + 1}</td>
                                            <td>{s.name}</td>
                                            <td>{s.email}</td>
                                            <td>{s.department}</td>
                                            <td><button className="delete-btn" onClick={() => removeStudent(s.id)}>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;
