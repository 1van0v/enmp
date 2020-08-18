import express from 'express';
import { v4 as uuid } from 'uuid';

import logger from './utils/logger';
import { users } from './users';

const port = 3000;

const app = express();

app.use(express.json());
app.use(logger);

app.get('/users', (req, res) => {
    return res.json({ users });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((i) => i.id === id);

    return user
        ? res.json(user)
        : res.status(404).json({ error: `Cannot find a user with ID ${id}` });
});

app.post('/users', (req, res) => {
    console.log('received a new user');
    const { login, password, age } = req.body;

    if (!(login && password && age)) {
        return res.status(400).json({ error: 'Required fields are missed' });
    }

    const newUser = {
        id: uuid(),
        login,
        password,
        age,
        isDeleted: false
    };

    users.push(newUser);
    res.json(newUser);
});

app.listen(port, () => {
    console.log('server is running on port', port);
});
