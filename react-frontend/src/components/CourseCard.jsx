import { Link } from "react-router-dom";

function CourseCard({ id, title, description, image, badge }) {
    return (
        <div className="card">
            {badge && <span className="badge">{badge}</span>}
            <img src={image || "https://placehold.co/300x180?text=Course"} alt={title} />
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
                <Link to={`/courses/${id}`} className="btn">View Details</Link>
            </div>
        </div>
    );
}

export default CourseCard;
