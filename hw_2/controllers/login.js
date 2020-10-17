import { Router } from 'express';

import { usersService } from '../services';
import { validator } from '../configs/validator';
import { loginSchema } from '../utils/validators';

const loginRouter = Router();

loginRouter.post('/', validator.body(loginSchema), async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const token = await usersService.login(username, password);
        res.json({ token });
        return next();
    } catch (e) {
        return next(e);
    }
});

export { loginRouter };
