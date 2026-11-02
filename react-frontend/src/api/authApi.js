import api from "../services/api";

export async function registerStudent(data) {
    const response = await api.post("/auth/register", data);
    return response.data;
}

export async function loginStudent(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
}

export async function forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
}

export async function resetPassword(token, password) {
    const response = await api.post(`/auth/reset-password/${encodeURIComponent(token)}`, { password });
    return response.data;
}
