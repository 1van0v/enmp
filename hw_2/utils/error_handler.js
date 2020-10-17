import { logger } from './logger';

export function validationErrorHandler(err, req, res, next) {
    const isJoiError = err && err.error && err.error.isJoi;
    const isUniqueError = err.constructor.name === 'UniqueConstraintError';
    let error;

    if (isJoiError || isUniqueError) {
        error = isJoiError ? err.error.toString() : err.errors[0].message;
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
