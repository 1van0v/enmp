import { Users } from '../models';
import { Op } from 'sequelize';

export class UsersService {
    constructor(users) {
        this.users = users;
    }

    getUser(id) {
        return this.users.findByPk(id);
    }

    getUsers() {
        return this.users.findAll();
    }

    getSuggestions(str, limit) {
        return this.users.findAll({
            where: {
                login: {
                    [Op.substring]: str
                }
            },
            order: [['login', 'ASC']],
            limit
        });
    }

    addUser(user) {
        return this.users.create(user);
    }

    async updateUser(id, update) {
        await this.users.update(update, { where: { id } });
        return this.getUser(id);
    }

    async deleteUser(id) {
        return this.updateUser(id, { isDeleted: true });
    }
}

export const usersService = new UsersService(Users);
