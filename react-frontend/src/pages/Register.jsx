import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PasswordInput from "../components/PasswordInput";
import { registerStudent } from "../api/authApi";
import { getErrorMessage } from "../services/api";
import { validateEmail, validatePassword, validatePhone, validateRequired } from "../utils/validation";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        // Student-specific fields
        phone: "",
        department: "",
        gradYear: "",
        // Admin-specific fields
        employeeId: "",
        designation: "",
        adminDepartment: "",
        officePhone: "",
        adminKey: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (selectedRole) => {
        setFormData((prev) => ({ ...prev, role: selectedRole }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        // ---- client-side validation (blocks submit when invalid)
        const isStudent = formData.role === "student";
        const problem =
            validateRequired("Full name", formData.name) ||
            validateEmail(formData.email) ||
            (isStudent && validatePhone(formData.phone)) ||
            (isStudent && validateRequired("Graduation year", formData.gradYear)) ||
            (isStudent && validateRequired("Department", formData.department)) ||
            (!isStudent && validateRequired("Employee ID", formData.employeeId)) ||
            (!isStudent && validateRequired("Managing department", formData.adminDepartment)) ||
            (!isStudent && validateRequired("Admin registration key", formData.adminKey)) ||
            validatePassword(formData.password) ||
            (formData.password !== formData.confirmPassword ? "Passwords do not match" : "");
        if (problem) {
            setError(problem);
            return;
        }

        setLoading(true);
        try {
            // Prepare payload matching your backend expectations
            const userPayload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                department: formData.role === "student" ? formData.department : formData.adminDepartment,
                role: formData.role,
                phone: formData.phone,
                gradYear: formData.gradYear,
                employeeId: formData.employeeId,
                designation: formData.designation,
                officePhone: formData.officePhone,
                adminKey: formData.adminKey
            };

            // Call your Express backend API
            await registerStudent(userPayload);

            navigate("/login", { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, "Registration failed. Is the backend running?"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
            <Navbar />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2.5rem 1.5rem" }}>
                <div className="auth-card" style={{
                    display: "flex",
                    width: "100%",
                    maxWidth: "980px",
                    background: "#ffffff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e0e7ff"
                }}>
                    
                    {/* Left Banner */}
                    <div className="auth-banner" style={{
                        flex: 1,
                        background: formData.role === "student" 
                            ? "linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)" 
                            : "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)",
                        padding: "3rem 2.5rem",
                        color: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        transition: "background 0.3s ease"
                    }}>
                        <span style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                            {formData.role === "student" ? "🎓" : "🛠️"}
                        </span>
                        <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 1rem 0" }}>
                            {formData.role === "student" ? "Start Your Journey" : "Admin Console Access"}
                        </h2>
                        <p style={{ color: "#f3e8ff", lineHeight: "1.6", margin: 0 }}>
                            {formData.role === "student" 
                                ? "Join thousands of learners worldwide gaining top industry skills and certificates." 
                                : "Manage courses, track student analytics, and handle faculty administrative tasks."}
                        </p>
                    </div>

                    {/* Right Form */}
                    <div style={{ flex: 1.3, padding: "2.5rem 2.5rem" }}>
                        <h2 style={{ fontSize: "1.8rem", color: "#1e1b4b", margin: "0 0 0.25rem 0", fontWeight: "800" }}>
                            {formData.role === "student" ? "Student Registration" : "Admin Registration"}
                        </h2>
                        <p style={{ color: "#64748b", margin: "0 0 1.5rem 0", fontSize: "0.9rem" }}>
                            Enter your official details to set up your account.
                        </p>

                        {error && (
                            <div style={{ padding: "0.75rem", marginBottom: "1rem", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontSize: "0.85rem" }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} noValidate style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            
                            {/* Role Selector Tabs */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#475569", marginBottom: "0.4rem" }}>
                                    ACCOUNT TYPE:
                                </label>
                                <div style={{ display: "flex", gap: "0.5rem", background: "#f1f5f9", padding: "0.25rem", borderRadius: "8px" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleRoleChange("student")}
                                        style={{
                                            flex: 1,
                                            padding: "0.45rem",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "700",
                                            fontSize: "0.85rem",
                                            background: formData.role === "student" ? "#ffffff" : "transparent",
                                            color: formData.role === "student" ? "#7c3aed" : "#64748b",
                                            boxShadow: formData.role === "student" ? "0 2px 4px rgba(0,0,0,0.05)" : "none"
                                        }}
                                    >
                                        👨‍🎓 Student
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRoleChange("admin")}
                                        style={{
                                            flex: 1,
                                            padding: "0.45rem",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "700",
                                            fontSize: "0.85rem",
                                            background: formData.role === "admin" ? "#ffffff" : "transparent",
                                            color: formData.role === "admin" ? "#2563eb" : "#64748b",
                                            boxShadow: formData.role === "admin" ? "0 2px 4px rgba(0,0,0,0.05)" : "none"
                                        }}
                                    >
                                        🛠️ Admin
                                    </button>
                                </div>
                            </div>

                            {/* Common Field: Name */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="e.g. Alex Johnson"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                />
                            </div>

                            {/* Common Field: Email */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="alex@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                />
                            </div>

                            {/* DYNAMIC FIELDS FOR STUDENT */}
                            {formData.role === "student" && (
                                <>
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                placeholder="+1 234 567 890"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                            />
                                        </div>
                                        <div style={{ flex: 0.8 }}>
                                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                                Graduation Year
                                            </label>
                                            <input
                                                type="number"
                                                name="gradYear"
                                                required
                                                placeholder="2026"
                                                value={formData.gradYear}
                                                onChange={handleChange}
                                                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                            Department / Major
                                        </label>
                                        <select
                                            name="department"
                                            required
                                            value={formData.department}
                                            onChange={handleChange}
                                            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box", background: "#fff" }}
                                        >
                                            <option value="">Select Major</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Software Engineering">Software Engineering</option>
                                            <option value="Business Administration">Business Administration</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* DYNAMIC FIELDS FOR ADMIN */}
                            {formData.role === "admin" && (
                                <>
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                                Employee ID
                                            </label>
                                            <input
                                                type="text"
                                                name="employeeId"
                                                required
                                                placeholder="EMP-9021"
                                                value={formData.employeeId}
                                                onChange={handleChange}
                                                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                                Designation / Title
                                            </label>
                                            <input
                                                type="text"
                                                name="designation"
                                                required
                                                placeholder="Professor / Dept Head"
                                                value={formData.designation}
                                                onChange={handleChange}
                                                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                                Managing Department
                                            </label>
                                            <select
                                                name="adminDepartment"
                                                required
                                                value={formData.adminDepartment}
                                                onChange={handleChange}
                                                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box", background: "#fff" }}
                                            >
                                                <option value="">Select Department</option>
                                                <option value="School of Computing">School of Computing</option>
                                                <option value="Engineering & Tech">Engineering & Tech</option>
                                                <option value="Management Studies">Management Studies</option>
                                                <option value="Academic Operations">Academic Operations</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                                Office Extension / Contact
                                            </label>
                                            <input
                                                type="text"
                                                name="officePhone"
                                                required
                                                placeholder="Ext. 4022"
                                                value={formData.officePhone}
                                                onChange={handleChange}
                                                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {formData.role === "admin" && (
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                        Admin Registration Key
                                    </label>
                                    <PasswordInput
                                        name="adminKey"
                                        placeholder="Ask the system owner for this key"
                                        value={formData.adminKey}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                    />
                                </div>
                            )}

                            {/* Passwords Row */}
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                        Password
                                    </label>
                                    <PasswordInput
                                        name="password"
                                        required
                                        minLength={8}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
                                        Confirm Password
                                    </label>
                                    <PasswordInput
                                        name="confirmPassword"
                                        required
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: "0.8rem",
                                    background: "#10b981",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    fontSize: "0.95rem",
                                    cursor: "pointer",
                                    marginTop: "0.5rem",
                                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? "Registering..." : "Complete Registration"}
                            </button>
                        </form>

                        <p style={{ textAlign: "center", marginTop: "1.25rem", color: "#64748b", fontSize: "0.85rem" }}>
                            Already have an account?{" "}
                            <Link to="/login" style={{ color: "#7c3aed", fontWeight: "700", textDecoration: "none" }}>
                                Log In
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Register;