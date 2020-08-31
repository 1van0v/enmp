export default (err, req, res, next) => {
    let error;

    if (err && err.error && err.error.isJoi) {
        error = err.error.toString();
    } else if (!err.message) {
        error = 'Something terrible wrong happened';
    } else {
        error = err.message;
    }

    res.status(400).json({ error });
    next();
};
