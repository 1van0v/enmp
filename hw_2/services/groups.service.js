import { Groups } from '../models';

export class GroupsService {
    constructor(groups) {
        this.groups = groups;
    }

    getGroup(id) {
        return this.groups.findByPk(id);
    }

    getGroups() {
        return this.groups.findAll();
    }

    addGroup(group) {
        return this.groups.create(group);
    }

    async updateGroup(id, update) {
        await this.groups.update(update, { where: { id } });
        return this.getGroup(id);
    }

    deleteGroup(id) {
        return this.groups.destroy({ where: { id } });
    }
}

export const groupsService = new GroupsService(Groups);
