import { Sequelize, DataTypes } from 'sequelize';
import { Op } from 'sequelize';

export function UsersModel(sequelize, groupsModel) {
    const queryConfig = {
        include: [
            {
                model: groupsModel,
                as: 'groups'
            }
        ]
    };

    const model = sequelize.define(
        'Users',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            login: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
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

    model.getUser = (id) => model.findByPk(id, queryConfig);
    model.getUsers = () => model.findAll(queryConfig);
    model.updateUser = (id, update) => model.update(update, { where: { id } });
    model.deleteUser = (id) => model.updateUser(id, { isDeleted: true });

    model.getSuggestions = (str, limit) =>
        model.findAll({
            where: {
                login: {
                    [Op.substring]: str
                }
            },
            order: [['login', 'ASC']],
            limit,
            ...queryConfig
        });

    model.getAuthUser = (login, password) =>
        model.findAll({
            where: {
                login: {
                    [Op.eq]: login
                },
                password: {
                    [Op.eq]: password
                }
            },
            limit: 1,
            attributes: ['id']
        });

    return model;
}
