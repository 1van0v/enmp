import jwt from 'jsonwebtoken';

const secret = process.env.API_SECRET;

export function tokenValidator(req, res, next) {
    if (req.path === '/login') {
        return next();
    }

    const token = req.get('Authorization');

    if (!token) {
        return next({ isAuthError: true, message: 'Unauthorized' });
    }

    jwt.verify(token, secret, (error) => {
        if (error) {
            return next({ isForbiddenError: true, message: 'Forbidden' });
        }

        return next();
    });
}
