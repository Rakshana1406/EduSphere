import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import MyCourses from "./pages/MyCourses";
import StartCourse from "./pages/StartCourse";
import Certificate from "./pages/Certificate";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import ManageEnrollment from "./pages/ManageEnrollment";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const student = ["student"];
const admin = ["admin"];

function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />

            {/* Student only */}
            <Route path="/dashboard" element={<ProtectedRoute roles={student}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/my-courses" element={<ProtectedRoute roles={student}><MyCourses /></ProtectedRoute>} />
            <Route path="/start-course" element={<ProtectedRoute roles={student}><StartCourse /></ProtectedRoute>} />
            <Route path="/certificate" element={<ProtectedRoute roles={student}><Certificate /></ProtectedRoute>} />
            <Route path="/enrollment-success" element={<ProtectedRoute roles={student}><EnrollmentSuccess /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin-dashboard" element={<ProtectedRoute roles={admin}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/manage-enrollment" element={<ProtectedRoute roles={admin}><ManageEnrollment /></ProtectedRoute>} />
            <Route path="/add-course" element={<ProtectedRoute roles={admin}><AddCourse /></ProtectedRoute>} />
            <Route path="/edit-course/:id" element={<ProtectedRoute roles={admin}><EditCourse /></ProtectedRoute>} />

            {/* Any logged-in user */}
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
