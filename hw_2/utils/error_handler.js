import { logger } from './logger';

export function validationErrorHandler(err, req, res, next) {
    let error;

    if (err && err.error && err.error.isJoi) {
        error = err.error.toString();
        logger.error('%s', error);
        res.status(400).json({ error });
        return next();
    }

    next(err);
}

export function internalErrorHandler(err, req, res, next) {
    logger.error('internal server error %s', err);
    res.status(500).json({ error: 'Internal Server Error' });
    next();
}
