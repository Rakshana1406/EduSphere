import { parseVideo } from "../utils/video";

function VideoPlayer({ url, title }) {
    const video = parseVideo(url);

    if (!video) {
        return <div className="video-missing">No video has been added for this module yet.</div>;
    }

    if (video.kind === "embed") {
        return (
            <div>
                <div className="video-frame">
                    <iframe
                        src={video.src}
                        title={title}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                </div>
                <a className="video-fallback" href={video.href} target="_blank" rel="noopener noreferrer">
                    Video not loading? Open it in a new tab ↗
                </a>
            </div>
        );
    }

    if (video.kind === "file") {
        return <video className="video-file" controls src={video.src} />;
    }

    return (
        <a className="btn-block" href={video.href} target="_blank" rel="noopener noreferrer">
            ▶ Open video in a new tab
        </a>
    );
}

export default VideoPlayer;
