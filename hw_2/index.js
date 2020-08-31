import express from 'express';

import logger from './utils/logger';
import errorHandler from './utils/error_handler';
import { usersRouter } from './controllers/users';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(logger);

app.use('/users', usersRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log('server is running on port', port);
});
