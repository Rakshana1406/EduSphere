// Turns an admin-pasted video link into something safe to show.
// Returns { kind: "embed" | "file" | "link", src, href } or null.
export function parseVideo(rawUrl) {
    if (!rawUrl || typeof rawUrl !== "string") return null;

    let u;
    try {
        u = new URL(rawUrl.trim());
    } catch {
        return null;
    }
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;

    const host = u.hostname.replace(/^www\./, "");
    const safeId = (id) => (id && /^[\w-]{6,20}$/.test(id) ? id : null);

    // YouTube
    let ytId = null;
    if (host === "youtu.be") {
        ytId = safeId(u.pathname.slice(1).split("/")[0]);
    } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
        if (u.pathname === "/watch") {
            ytId = safeId(u.searchParams.get("v"));
        } else {
            const m = u.pathname.match(/^\/(embed|shorts|live|v)\/([^/?]+)/);
            ytId = safeId(m && m[2]);
        }
    }
    if (ytId) return { kind: "embed", src: `https://www.youtube.com/embed/${ytId}`, href: u.href };

    // Vimeo
    if (host === "vimeo.com" || host === "player.vimeo.com") {
        const m = u.pathname.match(/(\d{5,})/);
        if (m) return { kind: "embed", src: `https://player.vimeo.com/video/${m[1]}`, href: u.href };
    }

    // Direct video file
    if (/\.(mp4|webm|ogg)$/i.test(u.pathname)) return { kind: "file", src: u.href, href: u.href };

    // Anything else: just offer a link
    return { kind: "link", src: u.href, href: u.href };
}
