import { Sequelize, DataTypes } from 'sequelize';

import { sequelize } from '../configs/database';

const Users = sequelize.define(
    'Users',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.NUMERIC,
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    { tableName: 'users', timestamps: false }
);

Users.sync();

export { Users };
