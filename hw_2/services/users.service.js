import { Users } from '../models';

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
        return this.deleteUser(id);
    }
}

export const usersService = new UsersService(Users);
