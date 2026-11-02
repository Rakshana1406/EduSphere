import { useState } from "react";
import { useRealtime } from "../context/RealtimeContext";

function NotificationBell() {
    const { notifications, unreadCount, markAllRead, connected } = useRealtime();
    const [open, setOpen] = useState(false);

    function toggle() {
        if (!open && unreadCount > 0) markAllRead();
        setOpen(!open);
    }

    return (
        <div className="bell-wrap">
            <button className="bell-btn" onClick={toggle} aria-label="Notifications" title={connected ? "Live" : "Offline"}>
                🔔
                {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
                <span className={`status-dot ${connected ? "on" : "off"}`} />
            </button>
            {open && (
                <div className="bell-panel">
                    <strong>Notifications</strong>
                    {notifications.length === 0 ? (
                        <p className="muted">No notifications yet.</p>
                    ) : (
                        <ul>
                            {notifications.slice(0, 15).map((n) => (
                                <li key={n.id}>
                                    {n.message}
                                    <small>{new Date(n.createdAt).toLocaleString()}</small>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
