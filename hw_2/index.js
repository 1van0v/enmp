import express from 'express';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';
import { Op } from 'sequelize';

import logger from './utils/logger';
import { Users } from './models/users';

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

app.get('/users', async (req, res) => {
    const { loginSubstring, limit } = req.query;
    let findOptions;

    if (loginSubstring && limit) {
        findOptions = {
            where: {
                login: {
                    [Op.substring]: loginSubstring
                }
            },
            order: [['login', 'ASC']],
            limit
        };
    }

    const users = await Users.findAll(findOptions);

    return res.json({ users });
});

app.get('/users/:id', async (req, res, next) => {
    const { id } = req.params;

    const user = await Users.findByPk(id);

    if (!user) {
        return next(new Error(`no users with id=${id}`));
    }

    return res.json(user);
});

app.post('/users', validator.body(addUserSchema), async (req, res, next) => {
    const { login, password, age } = req.body;

    try {
        const user = await Users.create({ login, password, age });
        res.json(user);
    } catch (e) {
        return next(e);
    }
});

app.put(
    '/users/:id',
    validator.body(updateUserSchema),
    async (req, res, next) => {
        if (!Object.keys(req.body).length) {
            return next(new Error('specify update values'));
        }

        try {
            const updated = await Users.update(req.body, {
                where: { id: req.params.id }
            }).then(() => Users.findByPk(req.params.id));

            res.json(updated);
        } catch (e) {
            return next(e);
        }
    }
);

app.delete('/users/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const deleted = await Users.update(
            { isDeleted: true },
            { where: { id } }
        ).then(() => Users.findByPk(id));

        res.status(200).json(deleted);
    } catch (e) {
        return next(e);
    }
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
