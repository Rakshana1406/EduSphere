// Course pictures are stored in the database as small data-URLs (no file server needed).
export const MAX_IMAGE_CHARS = 85000; // keep in sync with backend/middleware/courseValidation.js

// Reads a picture, shrinks it and converts it to WebP so it stays small.
export function fileToResizedDataUrl(file) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
            reject(new Error("Please choose a PNG, JPG or WebP image."));
            return;
        }
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Could not read the file."));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error("That file is not a valid image."));
            img.onload = () => {
                const attempts = [[480, 0.85], [400, 0.75], [320, 0.7], [260, 0.6], [200, 0.55]];
                for (const [maxSide, quality] of attempts) {
                    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
                    const canvas = document.createElement("canvas");
                    canvas.width = Math.max(1, Math.round(img.width * scale));
                    canvas.height = Math.max(1, Math.round(img.height * scale));
                    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                    const url = canvas.toDataURL("image/webp", quality);
                    if (url.length <= MAX_IMAGE_CHARS) {
                        resolve(url);
                        return;
                    }
                }
                reject(new Error("This picture is too detailed. Try a simpler image or paste an image link instead."));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}
