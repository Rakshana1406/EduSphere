import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getErrorMessage } from "../services/api";

function ManageEnrollment() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/enrollments")
            .then((res) => setList(res.data.data))
            .catch((err) => setError(getErrorMessage(err, "Unable to load enrollments.")))
            .finally(() => setLoading(false));
    }, []);

    async function remove(id) {
        if (!window.confirm("Remove this enrollment?")) return;
        try {
            await api.delete(`/enrollments/${id}`);
            setList((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            setError(getErrorMessage(err, "Unable to remove enrollment."));
        }
    }

    return (
        <>
            <Navbar />
            <div className="dash-wrap">
                <h2>Manage Student Enrollments</h2>
                {loading && <p>Loading...</p>}
                {error && <div className="alert-error">{error}</div>}
                {!loading && list.length === 0 && <div className="empty-box"><p>No enrollments yet.</p></div>}

                {list.length > 0 && (
                    <div className="info-card table-scroll">
                        <table className="data-table">
                            <thead>
                                <tr><th>Student</th><th>Email</th><th>Course</th><th>Status</th><th>Enrolled</th><th /></tr>
                            </thead>
                            <tbody>
                                {list.map((e) => (
                                    <tr key={e.id}>
                                        <td>{e.student?.name || "—"}</td>
                                        <td>{e.student?.email || "—"}</td>
                                        <td>{e.course?.courseName || "—"}</td>
                                        <td><span className={`pill ${e.status === "completed" ? "green" : "blue"}`}>{e.status}</span></td>
                                        <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                                        <td><button className="delete-btn" onClick={() => remove(e.id)}>Remove</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default ManageEnrollment;
