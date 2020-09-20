import { DataTypes } from 'sequelize';

export function UserGroupModel(sequelize, Users, Groups) {
    return sequelize.define(
        'UserGroup',
        {
            user_id: {
                type: DataTypes.UUID,
                references: {
                    model: Users,
                    key: 'id'
                }
            },
            group_id: {
                type: DataTypes.UUID,
                references: {
                    model: Groups,
                    key: 'id'
                }
            }
        },
        { tableName: 'UserGroup', timestamps: false }
    );
}
