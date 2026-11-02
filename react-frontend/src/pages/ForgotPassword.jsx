import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { forgotPassword } from "../api/authApi";
import { getErrorMessage } from "../services/api";
import { validateEmail } from "../utils/validation";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const problem = validateEmail(email);
        setFieldError(problem);
        if (problem) return;

        setLoading(true);
        try {
            await forgotPassword(email.trim());
            setSent(true);
        } catch (err) {
            setError(getErrorMessage(err, "Unable to send the reset link. Is the backend running?"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-bg">
            <Navbar />
            <div className="auth-wrap">
                <div className="auth-card single">
                    <div className="auth-form">
                        <h2>Forgot Password?</h2>

                        {sent ? (
                            <>
                                <div className="alert-info" style={{ cursor: "default" }}>
                                    If <strong>{email.trim()}</strong> is registered, a password reset link has been sent.
                                    It is valid for 15 minutes. Please check your inbox (and spam folder).
                                </div>
                                <p className="center muted"><Link to="/login">← Back to Login</Link></p>
                            </>
                        ) : (
                            <>
                                <p className="muted">Enter your account email and we'll send you a link to reset your password.</p>
                                {error && <div className="alert-error">{error}</div>}
                                <form onSubmit={handleSubmit} noValidate>
                                    <label htmlFor="email">Email Address</label>
                                    <input id="email" type="email" placeholder="e.g. alex@example.com"
                                        value={email} onChange={(e) => { setEmail(e.target.value); setFieldError(""); }} />
                                    {fieldError && <span className="field-error">{fieldError}</span>}

                                    <button type="submit" className="btn-submit" disabled={loading}>
                                        {loading ? "Sending..." : "Send Reset Link"}
                                    </button>
                                </form>
                                <p className="center muted"><Link to="/login">← Back to Login</Link></p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
