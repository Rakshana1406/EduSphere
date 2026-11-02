import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const home = isAdmin ? "/admin-dashboard" : "/dashboard";
    const close = () => setOpen(false);

    function handleLogout() {
        logout();
        close();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to={isAuthenticated ? home : "/"} className="brand" onClick={close} aria-label="EduSphere home">
                    <img src="/logo-white.svg" alt="EduSphere" />
                </Link>
                {isAuthenticated && (
                    <span className={`role-pill ${isAdmin ? "admin" : "student"}`}>
                        {isAdmin ? "Admin Portal" : "Student Portal"}
                    </span>
                )}
            </div>

            <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>

            <div className={`navbar-links ${open ? "open" : ""}`}>
                {!isAuthenticated && <NavLink to="/" end onClick={close}>Home</NavLink>}
                {isAuthenticated && <NavLink to={home} onClick={close}>Dashboard</NavLink>}
                <NavLink to="/courses" onClick={close}>Courses</NavLink>
                {user?.role === "student" && <NavLink to="/my-courses" onClick={close}>My Courses</NavLink>}
                {isAdmin && <NavLink to="/manage-enrollment" onClick={close}>Enrollments</NavLink>}
                {isAuthenticated && <NavLink to="/chat" onClick={close}>Chat</NavLink>}

                {isAuthenticated ? (
                    <>
                        <NotificationBell />
                        <span className="nav-user">{user.name}</span>
                        <button className="btn-logout" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" onClick={close}>Login</NavLink>
                        <Link to="/register" className="btn-primary-sm" onClick={close}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
