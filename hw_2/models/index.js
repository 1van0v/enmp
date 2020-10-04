import 'dotenv/config.js';
import { Sequelize } from 'sequelize';

import { UsersModel } from './users';
import { GroupsModel } from './groups';
import { UserGroupModel } from './user_group';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: { rejectUnauthorized: false } }
});

const Groups = GroupsModel(sequelize);
const Users = UsersModel(sequelize, Groups);
const UserGroup = UserGroupModel(sequelize, Users, Groups);

Users.belongsToMany(Groups, {
    through: UserGroup,
    foreignKey: 'user_id',
    as: 'groups'
});
Groups.belongsToMany(Users, { through: UserGroup, foreignKey: 'group_id' });

export { Users, Groups, UserGroup };
