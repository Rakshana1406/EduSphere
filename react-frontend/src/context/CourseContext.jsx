import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/courses");
            setCourses(response.data.data); // API shape: { success, count, data: [...] }
            setError(null);
        } catch (err) {
            setError(getErrorMessage(err, "Unable to load courses."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    async function addCourse(course) {
        const response = await api.post("/courses", course);
        setCourses((prev) => [...prev, response.data.data]);
        return response.data.data;
    }

    async function updateCourse(id, updated) {
        const response = await api.put(`/courses/${id}`, updated);
        setCourses((prev) => prev.map((c) => (c.id === id ? response.data.data : c)));
        return response.data.data;
    }

    async function deleteCourse(id) {
        await api.delete(`/courses/${id}`);
        setCourses((prev) => prev.filter((c) => c.id !== id));
    }

    return (
        <CourseContext.Provider value={{ courses, loading, error, fetchCourses, addCourse, updateCourse, deleteCourse }}>
            {children}
        </CourseContext.Provider>
    );
}

export function useCourses() {
    return useContext(CourseContext);
}
