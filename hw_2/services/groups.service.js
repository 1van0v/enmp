import { Groups, UserGroup } from '../models';

import { sequelize } from '../models';

export class GroupsService {
    constructor(groups, userGroup) {
        this.groups = groups;
        this.userGroup = userGroup;
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

    async addUsersToGroup(groupId, userIds) {
        const transaction = await sequelize.transaction();

        try {
            const updates = userIds.map(userId => this.userGroup.create(
                {
                    user_id: userId,
                    group_id: groupId
                },
                { transaction }
            ));

            await Promise.all(updates);
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
        }
    }
}

export const groupsService = new GroupsService(Groups, UserGroup);
