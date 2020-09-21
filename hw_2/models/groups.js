import { Sequelize, DataTypes } from 'sequelize';

export const GroupsModel = sequelize => sequelize.define(
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
