import { useEffect, useState } from "react";
import { useCourses } from "../context/CourseContext";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ImageField from "../components/ImageField";

function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { courses, updateCourse } = useCourses();

    const course = courses.find((item) => item.id === id);

    const [courseName, setCourseName] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [instructor, setInstructor] = useState("");
    const [duration, setDuration] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [modules, setModules] = useState([{ title: "", videoUrl: "" }, { title: "", videoUrl: "" }, { title: "", videoUrl: "" }]);

    useEffect(() => {
        if (course) {
            setCourseName(course.courseName || "");
            setCourseCode(course.courseCode || "");
            setInstructor(course.instructor || "");
            setDuration(course.duration || "");
            setCategory(course.category || "");
            setDescription(course.description || course.overview || "");
            setImage(course.image || "");
            setModules(
                [0, 1, 2].map((i) => {
                    const m = course.modules?.[i];
                    return typeof m === "string"
                        ? { title: m, videoUrl: "" }
                        : { title: m?.title || "", videoUrl: m?.videoUrl || "" };
                })
            );
        }
    }, [course]);

    async function handleSubmit(e) {
        e.preventDefault();
        const updatedCourse = {
            level: course.level,
            status: course.status,
            image,
            learningOutcomes: course.learningOutcomes,
            modules,
            courseName,
            courseCode,
            instructor,
            duration,
            category,
            overview: description
        };

        try {
            await updateCourse(id, updatedCourse);
            alert("Course updated successfully!");
            navigate("/courses");
        } catch (error) {
            console.error("Error updating course:", error);
            alert("Unable to update course.");
        }
    }

    return (
        <>
        <Navbar />
        <div className="edit-course-container">
            <h2>Edit Course</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Course Name:</label>
                    <input 
                        type="text" 
                        value={courseName} 
                        onChange={(e) => setCourseName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Course Code:</label>
                    <input 
                        type="text" 
                        value={courseCode} 
                        onChange={(e) => setCourseCode(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Instructor:</label>
                    <input 
                        type="text" 
                        value={instructor} 
                        onChange={(e) => setInstructor(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Duration:</label>
                    <input 
                        type="text" 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input 
                        type="text" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                </div>
                <ImageField value={image} onChange={setImage} />

                {modules.map((m, i) => (
                    <fieldset key={i} className="module-fieldset">
                        <legend>Module {i + 1}</legend>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={m.title}
                            onChange={(e) => setModules(modules.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                            required
                        />
                        <label>Video link (YouTube / Vimeo):</label>
                        <input
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={m.videoUrl}
                            onChange={(e) => setModules(modules.map((x, j) => (j === i ? { ...x, videoUrl: e.target.value } : x)))}
                            required
                        />
                    </fieldset>
                ))}
                <button type="submit">Update Course</button>
            </form>
        </div>
        </>
    );
}

export default EditCourse;