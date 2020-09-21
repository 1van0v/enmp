import { Users, Groups, UserGroup } from '../models';
import { Op } from 'sequelize';

export class UsersService {
    get queryConfig() {
        return {
            include: [
                {
                    model: Groups,
                    as: 'groups'
                }
            ]
        };
    }

    constructor(users) {
        this.users = users;
    }

    getUser(id) {
        return this.users.findByPk(id, this.queryConfig);
    }

    getUsers() {
        return this.users.findAll(this.queryConfig);
    }

    getSuggestions(str, limit) {
        return this.users.findAll({
            where: {
                login: {
                    [Op.substring]: str
                }
            },
            order: [['login', 'ASC']],
            limit,
            ...this.queryConfig
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
