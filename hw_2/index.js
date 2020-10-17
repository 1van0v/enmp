import express from 'express';

import { requestLogger, logger } from './utils/logger';
import {
    validationErrorHandler,
    internalErrorHandler
} from './utils/error_handler';
import { timeTracker } from './utils/time_tracker';
import { usersRouter, groupsRouter, loginRouter } from './controllers';

const port = process.env.PORT || 3000;

const app = express();

app.use(timeTracker);
app.use(express.json());
app.use(requestLogger);

app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

app.use(validationErrorHandler);
app.use(internalErrorHandler);

app.listen(port, () => {
    logger.info('server is running on port %d', port);
});

process
    .on('unhandledRejection', (reason, p) => {
        logger.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', (err) => {
        logger.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });
