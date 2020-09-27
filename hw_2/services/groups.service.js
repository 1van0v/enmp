import { Groups, UserGroup } from '../models';

export class GroupsService {
    constructor(groups, userGroup) {
        this.groups = groups;
        this.userGroup = userGroup;
    }

    getGroup(id) {
        return this.groups.getGroup(id);
    }

    getGroups() {
        return this.groups.getGroups();
    }

    addGroup(group) {
        return this.groups.create(group);
    }

    async updateGroup(id, update) {
        await this.groups.updateGroup(id, update);
        return this.getGroup(id);
    }

    deleteGroup(id) {
        return this.groups.deleteGroup(id);
    }

    addUsersToGroup(groupId, userIds) {
        return this.groups.addUsersToGroup(groupId, userIds);
    }
}

export const groupsService = new GroupsService(Groups, UserGroup);
