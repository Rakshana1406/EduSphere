import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "../auth/AuthContext";
import { useRealtime } from "../context/RealtimeContext";

function Chat() {
    const { user } = useAuth();
    const { socket, connected, onlineIds } = useRealtime();

    const [contacts, setContacts] = useState([]);
    const [active, setActive] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [typingFrom, setTypingFrom] = useState(null);
    const [error, setError] = useState("");
    const activeRef = useRef(null);
    const bottomRef = useRef(null);
    const typingTimer = useRef(null);

    useEffect(() => {
        api.get("/messages/contacts")
            .then((res) => setContacts(res.data.data))
            .catch((err) => setError(getErrorMessage(err, "Unable to load contacts.")));
    }, []);

    // load history when a contact is opened
    useEffect(() => {
        activeRef.current = active;
        if (!active) return;
        api.get(`/messages/${active.id}`)
            .then((res) => setMessages(res.data.data))
            .catch((err) => setError(getErrorMessage(err, "Unable to load messages.")));
    }, [active]);

    // live events
    useEffect(() => {
        if (!socket) return undefined;

        function onMessage(msg) {
            const current = activeRef.current;
            if (current && (msg.from === current.id || msg.to === current.id)) {
                setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
            }
        }
        function onTyping({ from }) {
            setTypingFrom(from);
            clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => setTypingFrom(null), 1500);
        }

        socket.on("chat:message", onMessage);
        socket.on("chat:typing", onTyping);
        return () => {
            socket.off("chat:message", onMessage);
            socket.off("chat:typing", onTyping);
        };
    }, [socket]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function send(e) {
        e.preventDefault();
        const body = text.trim();
        if (!body || !active || !socket) return;
        socket.emit("chat:send", { to: active.id, text: body }, (res) => {
            if (!res?.ok) setError(res?.error || "Message not sent");
        });
        setText("");
    }

    function onType(e) {
        setText(e.target.value);
        if (active && socket) socket.emit("chat:typing", { to: active.id });
    }

    const sorted = useMemo(
        () => [...contacts].sort((a, b) => Number(onlineIds.includes(b.id)) - Number(onlineIds.includes(a.id))),
        [contacts, onlineIds]
    );

    return (
        <>
            <Navbar />
            <div className="chat-wrap">
                <aside className={`chat-contacts ${active ? "hide-mobile" : ""}`}>
                    <h3>Chat {connected ? "🟢" : "🔴"}</h3>
                    {sorted.length === 0 && <p className="muted">No other users yet.</p>}
                    {sorted.map((c) => (
                        <button key={c.id} className={`contact ${active?.id === c.id ? "active" : ""}`} onClick={() => setActive(c)}>
                            <span className={`status-dot ${onlineIds.includes(c.id) ? "on" : "off"}`} />
                            <span>{c.name}</span>
                            <small>{c.role}</small>
                        </button>
                    ))}
                </aside>

                <section className={`chat-main ${active ? "" : "hide-mobile"}`}>
                    {!active ? (
                        <p className="muted center" style={{ margin: "auto" }}>Select someone to start chatting.</p>
                    ) : (
                        <>
                            <div className="chat-head">
                                <button className="back-mobile" onClick={() => setActive(null)}>←</button>
                                <strong>{active.name}</strong>
                                <small>{onlineIds.includes(active.id) ? "online" : "offline"}</small>
                            </div>
                            {error && <div className="alert-error" onClick={() => setError("")}>{error}</div>}
                            <div className="chat-messages">
                                {messages.map((m) => (
                                    <div key={m.id} className={`bubble ${m.from === user.id ? "me" : "them"}`}>
                                        {m.text}
                                        <small>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
                                    </div>
                                ))}
                                {typingFrom === active.id && <div className="typing">{active.name} is typing...</div>}
                                <div ref={bottomRef} />
                            </div>
                            <form className="chat-input" onSubmit={send}>
                                <input value={text} onChange={onType} placeholder="Type a message..." maxLength={1000} />
                                <button type="submit" disabled={!connected || !text.trim()}>Send</button>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </>
    );
}

export default Chat;
