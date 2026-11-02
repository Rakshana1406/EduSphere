import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontSize: "72px", color: "#e63946", marginBottom: "10px" }}>404</h1>
      <h2 style={{ fontSize: "24px", color: "#1d3557", marginBottom: "15px" }}>Page Not Found</h2>
      <p style={{ color: "#457b9d", marginBottom: "25px" }}>
        The page or resource you are looking for does not exist or has been removed.
      </p>
      <Link 
        to="/" 
        style={{
          backgroundColor: "#1d3557",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          textDecoration: "none",
          fontWeight: "bold"
        }}
      >
        Return to Safety (Home)
      </Link>
    </div>
  );
}