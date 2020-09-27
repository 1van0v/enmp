import { Sequelize, DataTypes } from 'sequelize';

export function GroupsModel(sequelize) {
    const model = sequelize.define(
        'Groups',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            permissions: {
                type: DataTypes.ARRAY(DataTypes.ENUM('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')),
                allowNull: false
            }
        },
        { tableName: 'groups', timestamps: false }
    );

    model.getGroup = id => model.findByPk(id);
    model.getGroups = () => model.findAll();
    model.updateGroup = (id, update) => model.update(update, { where: { id } });
    model.deleteGroup = id => model.destroy({ where: { id } });

    model.addUsersToGroup = async (groupId, userIds) => {
        const transaction = await sequelize.transaction();

        try {
            const updates = userIds.map(userId => sequelize.model('UserGroup').create(
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
    };

    return model;
}
