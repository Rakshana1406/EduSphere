// Reusable client-side validators (Task 4/5). Each returns an error string or "".
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
export const isPhone = (v) => /^[+\d][\d\s\-()]{6,18}$/.test(String(v).trim());

export function validateEmail(v) {
    if (!String(v).trim()) return "Email is required";
    return isEmail(v) ? "" : "Enter a valid email address";
}

export function validatePassword(v) {
    if (!v) return "Password is required";
    if (v.length < 8) return "Password must be at least 8 characters";
    if (v.length > 72) return "Password must be at most 72 characters";
    return "";
}

export function validatePhone(v) {
    if (!String(v).trim()) return "Phone number is required";
    return isPhone(v) ? "" : "Enter a valid phone number";
}

export function validateRequired(label, v) {
    return String(v ?? "").trim() ? "" : `${label} is required`;
}
