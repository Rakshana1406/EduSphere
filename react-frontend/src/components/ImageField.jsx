import { useState } from "react";
import { fileToResizedDataUrl } from "../utils/image";

// Course picture picker: paste a link OR upload a file. Shows a live preview.
function ImageField({ value, onChange }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const isUploaded = Boolean(value && value.startsWith("data:"));

    async function handleFile(e) {
        const file = e.target.files?.[0];
        e.target.value = ""; // allow choosing the same file again
        if (!file) return;
        setBusy(true);
        setError("");
        try {
            onChange(await fileToResizedDataUrl(file));
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <fieldset className="module-fieldset image-field">
            <legend>Course Image</legend>

            <div className="image-preview">
                {value ? (
                    <img key={value} src={value} alt="Course preview" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                    <span className="muted">No image selected – a default picture will be shown.</span>
                )}
            </div>

            <label>Image link:</label>
            <input
                type="url"
                placeholder="https://example.com/python-logo.png"
                value={isUploaded ? "" : value || ""}
                onChange={(e) => onChange(e.target.value)}
            />

            <label>…or upload from your computer (PNG / JPG / WebP):</label>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} />

            {busy && <small className="muted">Processing image...</small>}
            {isUploaded && !busy && <small className="muted">Uploaded image ready ✔</small>}
            {error && <div className="alert-error">{error}</div>}
            {value && (
                <button type="button" className="link-btn" onClick={() => onChange("")}>Remove image</button>
            )}
        </fieldset>
    );
}

export default ImageField;
