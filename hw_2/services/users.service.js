import jwt from 'jsonwebtoken';

import { Users } from '../models';

const secret = process.env.API_SECRET;
const expirationTime = 60 * 60 * 60;

export class UsersService {
    constructor(users) {
        this.users = users;
    }

    getUser(id) {
        return this.users.getUser(id, this.queryConfig);
    }

    getUsers() {
        return this.users.getUsers();
    }

    getSuggestions(str, limit) {
        return this.users.getSuggestions(str, limit);
    }

    addUser(user) {
        return this.users.create(user);
    }

    async updateUser(id, update) {
        await this.users.updateUser(id, update);
        return this.getUser(id);
    }

    async deleteUser(id) {
        await this.users.deleteUser(id);
        return this.getUser(id);
    }

    async login(username, password) {
        const [authUser] = await this.users.getAuthUser(username, password);

        if (!authUser) {
            throw {
                isAuthError: true,
                message: 'login or password is incorrect'
            };
        }

        return new Promise((resolve, reject) => {
            jwt.sign(
                { id: authUser.id },
                secret,
                { expiresIn: expirationTime },
                (error, token) => {
                    return error ? reject(error) : resolve(token);
                }
            );
        });
    }
}

export const usersService = new UsersService(Users);
