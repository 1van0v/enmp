import express from 'express';

import logger from './utils/logger';
import { users } from './users';

const port = 3000;

const app = express();

app.use(express.json());
app.use(logger);

app.get('/api/users', (req, res) => {
    return res.json({ users });
});

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((i) => i.id === id);

    return user
        ? res.json(user)
        : res.status(404).json({ error: `Cannot find a user with ID ${id}` });
});

app.listen(port, () => {
    console.log('server is running on port', port);
});
