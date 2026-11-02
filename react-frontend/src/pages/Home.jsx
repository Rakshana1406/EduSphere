import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";

function Home() {
    const { user } = useAuth();

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section style={{ 
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)", 
                color: "#ffffff", 
                padding: "5rem 1.5rem", 
                textAlign: "center" 
            }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <span style={{ 
                        background: "rgba(255, 255, 255, 0.2)", 
                        color: "#f3e8ff", 
                        padding: "0.4rem 1rem", 
                        borderRadius: "20px", 
                        fontSize: "0.85rem", 
                        fontWeight: "600",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        backdropFilter: "blur(4px)"
                    }}>
                        ✨ Welcome to EduSphere
                    </span>

                    <h1 style={{ fontSize: "3rem", margin: "1.5rem 0 1rem 0", lineHeight: "1.2", fontWeight: "800" }}>
                        Master New Skills, Elevate Your Career
                    </h1>

                    <p style={{ fontSize: "1.2rem", color: "#f3e8ff", marginBottom: "2.5rem", lineHeight: "1.6" }}>
                        Access high-quality courses, track your learning journey, and earn verified certifications all in one platform.
                    </p>

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                        <Link 
                            to="/courses" 
                            style={{ 
                                padding: "0.85rem 2rem", 
                                background: "#10b981", 
                                color: "#ffffff", 
                                textDecoration: "none", 
                                borderRadius: "8px", 
                                fontWeight: "700",
                                fontSize: "1rem",
                                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                            }}
                        >
                            Explore Courses
                        </Link>
                        
                        {!user && (
                            <Link 
                                to="/register" 
                                style={{ 
                                    padding: "0.85rem 2rem", 
                                    background: "#ffffff", 
                                    color: "#4f46e5", 
                                    textDecoration: "none", 
                                    borderRadius: "8px", 
                                    fontWeight: "700",
                                    fontSize: "1rem",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                                }}
                            >
                                Get Started Free
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* --- METRICS / STATS BAR --- */}
            <section style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "2rem 1.5rem" }}>
                <div style={{ 
                    maxWidth: "1000px", 
                    margin: "0 auto", 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                    gap: "2rem", 
                    textAlign: "center" 
                }}>
                    <div>
                        <h3 style={{ fontSize: "2.2rem", color: "#6366f1", margin: 0, fontWeight: "800" }}>50+</h3>
                        <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontWeight: "500" }}>Interactive Courses</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: "2.2rem", color: "#6366f1", margin: 0, fontWeight: "800" }}>10,000+</h3>
                        <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontWeight: "500" }}>Active Students</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: "2.2rem", color: "#6366f1", margin: 0, fontWeight: "800" }}>98%</h3>
                        <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontWeight: "500" }}>Completion Rate</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: "2.2rem", color: "#6366f1", margin: 0, fontWeight: "800" }}>Verified</h3>
                        <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontWeight: "500" }}>Digital Certificates</p>
                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section style={{ maxWidth: "1000px", margin: "4rem auto", padding: "0 1.5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h2 style={{ fontSize: "2.2rem", color: "#1e1b4b", margin: "0 0 0.5rem 0", fontWeight: "800" }}>Why Choose EduSphere?</h2>
                    <p style={{ color: "#64748b", margin: 0 }}>Everything you need to learn effectively and advance professionally.</p>
                </div>

                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                    gap: "2rem" 
                }}>
                    <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "12px", border: "1px solid #e0e7ff", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.05)" }}>
                        <div style={{ width: "48px", height: "48px", background: "#eef2ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>📚</div>
                        <h3 style={{ color: "#1e1b4b", marginTop: 0 }}>Comprehensive Library</h3>
                        <p style={{ color: "#64748b", lineHeight: "1.6" }}>Explore top-tier courses across Web Development, Data Science, and Software Engineering.</p>
                    </div>

                    <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "12px", border: "1px solid #e0e7ff", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.05)" }}>
                        <div style={{ width: "48px", height: "48px", background: "#eef2ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>⚡</div>
                        <h3 style={{ color: "#1e1b4b", marginTop: 0 }}>Self-Paced Learning</h3>
                        <p style={{ color: "#64748b", lineHeight: "1.6" }}>Study on your own schedule with dynamic content, progress tracking, and instant access.</p>
                    </div>

                    <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "12px", border: "1px solid #e0e7ff", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.05)" }}>
                        <div style={{ width: "48px", height: "48px", background: "#eef2ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>🎓</div>
                        <h3 style={{ color: "#1e1b4b", marginTop: 0 }}>Earn Certifications</h3>
                        <p style={{ color: "#64748b", lineHeight: "1.6" }}>Complete course requirements to earn shareable, printable certificates upon completion.</p>
                    </div>
                </div>
            </section>

            {/* --- CALL TO ACTION BANNER --- */}
            <section style={{ maxWidth: "1000px", margin: "0 auto 5rem auto", padding: "0 1.5rem" }}>
                <div style={{ 
                    background: "linear-gradient(135deg, #312e81 0%, #4338ca 100%)", 
                    borderRadius: "16px", 
                    padding: "3.5rem 2rem", 
                    textAlign: "center", 
                    color: "#ffffff",
                    boxShadow: "0 10px 25px -5px rgba(49, 46, 129, 0.3)"
                }}>
                    <h2 style={{ fontSize: "2.2rem", margin: "0 0 1rem 0", fontWeight: "800" }}>Ready to Start Your Journey?</h2>
                    <p style={{ color: "#c7d2fe", marginBottom: "2rem", fontSize: "1.1rem" }}>Join thousands of students building real-world skills today.</p>
                    <Link 
                        to="/courses" 
                        style={{ 
                            padding: "0.85rem 2.25rem", 
                            background: "#10b981", 
                            color: "#ffffff", 
                            textDecoration: "none", 
                            borderRadius: "8px", 
                            fontWeight: "700",
                            display: "inline-block",
                            fontSize: "1rem"
                        }}
                    >
                        Browse All Courses
                    </Link>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer style={{ background: "#1e1b4b", color: "#a5b4fc", textAlign: "center", padding: "2rem 1.5rem", borderTop: "1px solid #312e81" }}>
                <p style={{ margin: 0 }}>© 2026 EduSphere. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;