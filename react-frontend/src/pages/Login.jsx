import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PasswordInput from "../components/PasswordInput";
import { loginStudent } from "../api/authApi";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../services/api";
import { validateEmail, validatePassword } from "../utils/validation";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const errors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
        };
        setFieldErrors(errors);
        if (errors.email || errors.password) return; // block submit when invalid

        setLoading(true);
        try {
            const data = await loginStudent({ email: formData.email.trim(), password: formData.password });
            login(data);
            const fallback = data.student.role === "admin" ? "/admin-dashboard" : "/dashboard";
            navigate(location.state?.from || fallback, { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, "Unable to sign in. Is the backend running?"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-bg">
            <Navbar />
            <div className="auth-wrap">
                <div className="auth-card">
                    <div className="auth-banner" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}>
                        <span style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚀</span>
                        <h2>Welcome Back!</h2>
                        <p>Log in to access your courses, track your progress, and chat with other learners.</p>
                    </div>

                    <div className="auth-form">
                        <h2>Account Login</h2>
                        <p className="muted">Students and admins sign in here.</p>

                        {error && <div className="alert-error">{error}</div>}

                        <form onSubmit={handleLogin} noValidate>
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="email" name="email" placeholder="e.g. alex@example.com"
                                value={formData.email} onChange={handleChange} />
                            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}

                            <div className="label-row">
                                <label htmlFor="password">Password</label>
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                            <PasswordInput id="password" name="password" placeholder="••••••••" autoComplete="current-password"
                                value={formData.password} onChange={handleChange} />
                            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}

                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <p className="center muted">
                            Don't have an account? <Link to="/register">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
