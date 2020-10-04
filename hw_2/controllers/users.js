import { Router } from 'express';

import { usersService } from '../services';
import { validator } from '../configs/validator';
import {
    addUserSchema,
    updateUserSchema,
    isBodyEmpty
} from '../utils/validators';

const usersRouter = Router();

usersRouter.get('/', (req, res, next) => {
    const { loginSubstring, limit } = req.query;
    const dbReq =
        loginSubstring && limit
            ? usersService.getSuggestions(loginSubstring, limit)
            : usersService.getUsers();

    dbReq
        .then((users) => {
            res.json({ users });
            next();
        })
        .catch(next);
});

usersRouter.post('/', validator.body(addUserSchema), async (req, res, next) => {
    try {
        const user = await usersService.addUser(req.body);
        res.json(user);
        return next();
    } catch (e) {
        return next(e);
    }
});

usersRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await usersService.getUser(id);

        if (!user) {
            return next(new Error(`no users with id=${id}`));
        }

        res.json(user);
        return next();
    } catch (e) {
        return next(e);
    }
});

usersRouter.put(
    '/:id',
    validator.body(updateUserSchema),
    async (req, res, next) => {
        try {
            isBodyEmpty(req.body);
            const updated = await usersService.updateUser(
                req.params.id,
                req.body
            );
            res.json(updated);
            return next();
        } catch (e) {
            return next(e);
        }
    }
);

usersRouter.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await usersService.deleteUser(req.params.id);
        res.status(200).json(deleted);
        return next();
    } catch (e) {
        return next(e);
    }
});

export { usersRouter };
