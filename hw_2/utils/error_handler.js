import { logger } from './logger';

export function validationErrorHandler(err, req, res, next) {
    const isJoiError = err && err.error && err.error.isJoi;
    const isUniqueError = err.constructor.name === 'UniqueConstraintError';
    const { isAuthError, isForbiddenError } = err;
    const isKnownError =
        isJoiError || isUniqueError || isAuthError || isForbiddenError;
    let status = 400;
    let error;

    if (isKnownError) {
        if (isJoiError) error = err.error.toString();
        if (isUniqueError) error = err.errors[0].message;
        if (isAuthError || isForbiddenError) {
            error = err.message;
            status = isForbiddenError ? 403 : 401;
        }

        logger.error('%s', error);
        res.status(status).json({ error });
        return next();
    }

    next(err);
}

export function internalErrorHandler(err, req, res, next) {
    logger.error('internal server error %s', err);
    res.status(500).json({ error: 'Internal Server Error' });
    next();
}
