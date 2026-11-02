import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readUser() {
    try {
        return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => sessionStorage.getItem("token"));
    const [user, setUser] = useState(readUser);

    // data = response of POST /auth/login  ({ token, student })
    const login = useCallback((data) => {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.student));
        setToken(data.token);
        setUser(data.student);
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }, []);

    // api.js fires this when the server answers 401 for a stored token
    useEffect(() => {
        window.addEventListener("auth:expired", logout);
        return () => window.removeEventListener("auth:expired", logout);
    }, [logout]);

    const value = useMemo(
        () => ({
            user,
            token,
            login,
            logout,
            isAuthenticated: Boolean(token && user),
            isAdmin: user?.role === "admin",
            isStudent: user?.role === "student",
        }),
        [user, token, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
