import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// <ProtectedRoute roles={["admin"]}>...</ProtectedRoute>
function ProtectedRoute({ roles, children }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    if (roles && !roles.includes(user.role)) {
        return <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"} replace />;
    }
    return children;
}

export default ProtectedRoute;
