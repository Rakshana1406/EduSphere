import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EnrollmentSuccess() {
    return (
        <>
            <Navbar />
            <div className="center" style={{ padding: "60px 20px" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>🎉</div>
                <h2>Enrollment Successful!</h2>
                <p className="muted" style={{ margin: "15px 0 30px" }}>
                    You have successfully enrolled in the course. You can view it anytime under My Courses or your dashboard.
                </p>
                <div className="row" style={{ justifyContent: "center" }}>
                    <Link to="/my-courses" className="btn-block" style={{ flex: "0 0 auto" }}>Go to My Courses</Link>
                    <Link to="/dashboard" className="btn-block gray" style={{ flex: "0 0 auto" }}>Dashboard</Link>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default EnrollmentSuccess;
