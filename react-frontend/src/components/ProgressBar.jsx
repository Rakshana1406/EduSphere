function ProgressBar({ enrollment }) {
    const total = enrollment.course?.modules?.length || 0;
    const done = Math.min(enrollment.completedModules?.length || 0, total);
    const pct = total ? Math.round((done / total) * 100) : 0;

    return (
        <div className="progress-wrap">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <small>{done}/{total} modules • {pct}%</small>
        </div>
    );
}

export default ProgressBar;
