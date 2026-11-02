import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "../auth/AuthContext";

const EnrollmentContext = createContext(null);

export function EnrollmentProvider({ children }) {
    const { isStudent, isAuthenticated } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        if (!isStudent) {
            setEnrollments([]);
            return;
        }
        try {
            setLoading(true);
            const response = await api.get("/enrollments/my");
            setEnrollments(response.data.data);
            setError(null);
        } catch (err) {
            setError(getErrorMessage(err, "Unable to load your enrollments."));
        } finally {
            setLoading(false);
        }
    }, [isStudent]);

    useEffect(() => {
        refresh();
    }, [refresh, isAuthenticated]);

    async function enroll(courseId) {
        const response = await api.post("/enrollments", { courseId });
        setEnrollments((prev) => [response.data.data, ...prev]);
        return response.data.data;
    }

    async function drop(enrollmentId) {
        await api.delete(`/enrollments/${enrollmentId}`);
        setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
    }

    // Marks one module as done (modules unlock in order). The last one completes the course.
    async function completeModule(enrollmentId, index) {
        const response = await api.patch(`/enrollments/${enrollmentId}/modules/${index}/complete`);
        setEnrollments((prev) => prev.map((e) => (e.id === enrollmentId ? response.data.data : e)));
        return response.data.data;
    }

    const isEnrolled = (courseId) => enrollments.some((e) => e.course?.id === courseId);

    return (
        <EnrollmentContext.Provider value={{ enrollments, loading, error, refresh, enroll, drop, completeModule, isEnrolled }}>
            {children}
        </EnrollmentContext.Provider>
    );
}

export function useEnrollments() {
    return useContext(EnrollmentContext);
}
