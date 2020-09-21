import express from 'express';

import logger from './utils/logger';
import errorHandler from './utils/error_handler';
import { usersRouter, groupsRouter } from './controllers';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(logger);

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log('server is running on port', port);
});
