export function timeTracker(req, res, next) {
    req._timestamp = process.hrtime();

    res.once('finish', () => {
        res._timestamp = process.hrtime();
        res._processingTime = process.hrtime(req._timestamp);
    });
    next();
}

export function getProcessingTime(res) {
    const [seconds, nanoseconds] = res._processingTime || [0, 0];
    let time;
    let unit;

    if (seconds < 1) {
        time = seconds * 10e3 + nanoseconds * 10e-6;
        time = Math.round(time);
        unit = 'ms';
    } else {
        time = seconds + nanoseconds * 10e-9;
        time = time.toFixed(2);
        unit = 's';
    }
    return time + unit;
}
