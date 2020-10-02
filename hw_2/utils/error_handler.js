export function validationErrorHandler(err, req, res, next) {
    let error;

    if (err && err.error && err.error.isJoi) {
        error = err.error.toString();
        console.log('validtaion error', error);
        res.status(400).json({ error });
        return next();
    }

    next(err);
}

export function internalErrorHandler(err, req, res, next) {
    console.log('internal server error', err);
    res.status(500).json({ error: 'Internal Server Error' });
    next();
}
