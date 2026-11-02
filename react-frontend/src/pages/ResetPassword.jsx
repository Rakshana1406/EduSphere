import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PasswordInput from "../components/PasswordInput";
import { resetPassword } from "../api/authApi";
import { getErrorMessage } from "../services/api";
import { validatePassword } from "../utils/validation";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const problem = validatePassword(password) || (password !== confirm ? "Passwords do not match" : "");
        if (problem) {
            setError(problem);
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, password);
            setDone(true);
            setTimeout(() => navigate("/login", { replace: true }), 2500);
        } catch (err) {
            setError(getErrorMessage(err, "Unable to reset the password."));
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
                        <h2>Reset Password</h2>

                        {done ? (
                            <>
                                <div className="alert-info" style={{ cursor: "default" }}>
                                    ✅ Your password has been reset. Redirecting you to login...
                                </div>
                                <p className="center"><Link to="/login">Go to Login now</Link></p>
                            </>
                        ) : (
                            <>
                                <p className="muted">Choose a new password (at least 8 characters).</p>
                                {error && (
                                    <div className="alert-error">
                                        {error}{" "}
                                        {/invalid or has expired/i.test(error) && <Link to="/forgot-password">Request a new link</Link>}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} noValidate>
                                    <label htmlFor="password">New Password</label>
                                    <PasswordInput id="password" placeholder="••••••••" autoComplete="new-password"
                                        value={password} onChange={(e) => setPassword(e.target.value)} />

                                    <label htmlFor="confirm">Confirm New Password</label>
                                    <PasswordInput id="confirm" placeholder="••••••••" autoComplete="new-password"
                                        value={confirm} onChange={(e) => setConfirm(e.target.value)} />

                                    <button type="submit" className="btn-submit" disabled={loading}>
                                        {loading ? "Saving..." : "Reset Password"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
