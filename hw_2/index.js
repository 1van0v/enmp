import express from 'express';

import { requestLogger, logger } from './utils/logger';
import {
    validationErrorHandler,
    internalErrorHandler
} from './utils/error_handler';
import { usersRouter, groupsRouter } from './controllers';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

app.use(validationErrorHandler);
app.use(internalErrorHandler);

app.use(requestLogger);

app.listen(port, () => {
    logger.info('server is running on port %d', port);
});

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', (err) => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });
