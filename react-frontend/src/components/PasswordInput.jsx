import { useState } from "react";

function EyeIcon({ crossed }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
            {crossed && <line x1="3" y1="3" x2="21" y2="21" />}
        </svg>
    );
}

// Drop-in replacement for <input type="password"> with a show/hide eye button.
function PasswordInput({ style, ...props }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="pw-wrap">
            <input {...props} type={visible ? "text" : "password"} style={{ ...style, paddingRight: "2.8rem" }} />
            <button
                type="button"
                className="pw-toggle"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? "Hide password" : "Show password"}
                aria-pressed={visible}
                title={visible ? "Hide password" : "Show password"}
            >
                <EyeIcon crossed={visible} />
            </button>
        </div>
    );
}

export default PasswordInput;
