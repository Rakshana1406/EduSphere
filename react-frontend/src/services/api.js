import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// If the server says the token is invalid/expired, log the user out everywhere
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginCall = error.config?.url?.includes("/auth/login");
        if (error.response?.status === 401 && sessionStorage.getItem("token") && !isLoginCall) {
            window.dispatchEvent(new Event("auth:expired"));
        }
        return Promise.reject(error);
    }
);

export function getErrorMessage(error, fallback = "Something went wrong") {
    return error?.response?.data?.message || error?.message || fallback;
}

export default api;
