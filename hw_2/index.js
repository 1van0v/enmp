import express from 'express';
import { v4 as uuid } from 'uuid';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';

import logger from './utils/logger';
import { getAutoSuggestUsers } from './utils/getAutoSuggestUsers';
import { findUserById } from './utils/findUserById';
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
    const user = findUserById(users, req.params.id);

    return res.json(user);
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
        throw new Error('specify update values');
    }

    const userToUpdate = findUserById(users, req.params.id);

    ['login', 'password', 'age', 'isDeleted'].forEach((key) => {
        const update = req.body[key];
        if (update) {
            userToUpdate[key] = update;
        }
    });

    res.json(userToUpdate);
});

app.delete('/users/:id', (req, res) => {
    const userToUpdate = findUserById(users, req.params.id);

    userToUpdate.isDeleted = true;

    res.status(200).json(userToUpdate);
});

app.use((err, req, res, next) => {
    let error;

    if (err && err.error && err.error.isJoi) {
        error = err.error.toString();
    } else if (!err.message) {
        error = 'Something terrible wrong happened';
    } else {
        error = err.message;
    }

    res.status(400).json({ error });
    next();
});

app.listen(port, () => {
    console.log('server is running on port', port);
});
