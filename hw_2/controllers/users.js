import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import { usersService } from '../services/users.service';
import { addUserSchema, updateUserSchema } from '../utils/validators';

const usersRouter = Router();
const validator = createValidator({ passError: true });

usersRouter.get('/', (req, res, next) => {
    const { loginSubstring, limit } = req.query;
    const dbReq =
        loginSubstring && limit
            ? usersService.getSuggestions(loginSubstring, limit)
            : usersService.getUsers();

    dbReq.then((users) => res.json({ users })).catch(next);
});

usersRouter.post('/', validator.body(addUserSchema), async (req, res, next) => {
    try {
        const user = await usersService.addUser(req.body);
        res.json(user);
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
    } catch (e) {
        return next(e);
    }
});

usersRouter.put(
    '/:id',
    validator.body(updateUserSchema),
    async (req, res, next) => {
        if (!Object.keys(req.body).length) {
            return next(new Error('specify update values'));
        }

        try {
            const updated = await usersService.updateUser(
                req.params.id,
                req.body
            );
            res.json(updated);
        } catch (e) {
            return next(e);
        }
    }
);

usersRouter.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await usersService.deleteUser(req.params.id);
        res.status(200).json(deleted);
    } catch (e) {
        return next(e);
    }
});

export { usersRouter };
