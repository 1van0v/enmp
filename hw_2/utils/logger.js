import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
    format: format.combine(format.splat(), format.simple()),
    transports: [new transports.Console()]
});

export function requestLogger(req, res, next) {
    const body = Object.keys(req.body).length ? req.body : '';

    logger.info('%d %s %s %s', res.statusCode, req.method, req.path, body);

    next();
}
