import express from 'express';
import { v4 as uuid } from 'uuid';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';

import logger from './utils/logger';
import { getAutoSuggestUsers } from './utils/getAutoSuggestUsers';
import { users } from './users';

const port = 3000;

const app = express();
const validator = createValidator({ passError: true });

const addUserSchema = Joi.object({
    login: Joi.string().min(1).required(),
    password: Joi.string().alphanum().min(1).required(),
    age: Joi.number().integer().min(4).max(130).required()
});

const updateUserSchema = Joi.object({
    login: Joi.string().min(1),
    password: Joi.string().alphanum().min(1),
    age: Joi.number().integer().min(4).max(130),
    isDeleted: Joi.boolean()
});

app.use(express.json());
app.use(logger);

app.get('/users', (req, res) => {
    const { loginSubstring, limit } = req.query;

    if (loginSubstring && limit) {
        return res.json({
            users: getAutoSuggestUsers(users, loginSubstring, limit)
        });
    }

    return res.json({ users });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((i) => i.id === id);

    return user
        ? res.json(user)
        : res.status(404).json({ error: `Cannot find a user with ID ${id}` });
});

app.post('/users', validator.body(addUserSchema), (req, res) => {
    const { login, password, age } = req.body;

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

app.put('/users/:id', validator.body(updateUserSchema), (req, res) => {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({ error: 'specify update values' });
    }

    const userToUpdate = users.find((i) => i.id === req.params.id);

    if (!userToUpdate) {
        return res.status(400).json({ error: 'Cannot find such user' });
    }

    ['login', 'password', 'age', 'isDeleted'].forEach((key) => {
        const update = req.body[key];
        if (update) {
            userToUpdate[key] = update;
        }
    });

    res.json(userToUpdate);
});

app.delete('/users/:id', (req, res) => {
    const userToUpdate = users.find((i) => i.id === req.params.id);

    if (!userToUpdate) {
        return res.status(404).json({ error: 'cannot find such user' });
    }

    userToUpdate.isDeleted = true;

    res.status(200).json(userToUpdate);
});

app.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        return res.status(400).json({
            message: err.error.toString()
        });
    }

    return next(err);
});

app.listen(port, () => {
    console.log('server is running on port', port);
});
