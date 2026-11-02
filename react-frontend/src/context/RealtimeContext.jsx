import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api, { SOCKET_URL } from "../services/api";
import { useAuth } from "../auth/AuthContext";

const RealtimeContext = createContext(null);

export function RealtimeProvider({ children }) {
    const { token, isAuthenticated } = useAuth();
    const socketRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [onlineIds, setOnlineIds] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null);

    // Connect when logged in, disconnect on logout
    useEffect(() => {
        if (!isAuthenticated || !token) return undefined;

        const s = io(SOCKET_URL, { auth: { token }, transports: ["websocket", "polling"] });
        socketRef.current = s;
        setSocket(s);

        s.on("connect", () => setConnected(true));
        s.on("disconnect", () => setConnected(false));
        s.on("presence:list", (ids) => setOnlineIds(ids));
        s.on("presence", ({ userId, online }) =>
            setOnlineIds((prev) => (online ? [...new Set([...prev, userId])] : prev.filter((id) => id !== userId)))
        );
        s.on("notification", (n) => {
            setNotifications((prev) => [n, ...prev]);
            setToast(n);
        });

        api.get("/notifications").then((res) => setNotifications(res.data.data)).catch(() => {});

        return () => {
            s.disconnect();
            socketRef.current = null;
            setSocket(null);
            setConnected(false);
            setOnlineIds([]);
            setNotifications([]);
        };
    }, [isAuthenticated, token]);

    // auto-hide toast
    useEffect(() => {
        if (!toast) return undefined;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    const markAllRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        try {
            await api.patch("/notifications/read-all");
        } catch {
            /* ignore */
        }
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <RealtimeContext.Provider value={{ socket, connected, onlineIds, notifications, unreadCount, markAllRead }}>
            {children}
            {toast && (
                <div className="toast" role="status" onClick={() => setToast(null)}>
                    🔔 {toast.message}
                </div>
            )}
        </RealtimeContext.Provider>
    );
}

export function useRealtime() {
    return useContext(RealtimeContext);
}
