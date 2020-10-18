import { createLogger, format, transports } from 'winston';

import { getProcessingTime } from './time_tracker';

export const logger = createLogger({
    format: format.combine(format.splat(), format.simple()),
    transports: [new transports.Console()]
});

export function requestLogger(req, res, next) {
    const body = Object.keys(req.body).length ? req.body : '';

    res.once('finish', () => {
        logger.info(
            '%d %s %s %s %s',
            res.statusCode,
            getProcessingTime(res),
            req.method,
            req.path,
            body
        );
    });

    next();
}
