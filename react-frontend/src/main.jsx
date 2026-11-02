import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { EnrollmentProvider } from "./context/EnrollmentContext";
import { RealtimeProvider } from "./context/RealtimeContext";
import "./styles/app.css";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <CourseProvider>
                <EnrollmentProvider>
                    <RealtimeProvider>
                        <App />
                    </RealtimeProvider>
                </EnrollmentProvider>
            </CourseProvider>
        </AuthProvider>
    </BrowserRouter>
);
