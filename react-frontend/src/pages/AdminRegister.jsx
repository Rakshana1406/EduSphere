import { Navigate } from "react-router-dom";

// Admin sign-up now lives on the main Register page (Admin tab) so it goes through the real API.
function AdminRegister() {
    return <Navigate to="/register" replace />;
}

export default AdminRegister;
