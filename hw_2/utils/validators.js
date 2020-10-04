import Joi from '@hapi/joi';

export const addUserSchema = Joi.object({
    login: Joi.string().min(1).required(),
    password: Joi.string().alphanum().min(1).required(),
    age: Joi.number().integer().min(4).max(130).required()
});

export const updateUserSchema = Joi.object({
    login: Joi.string().min(1),
    password: Joi.string().alphanum().min(1),
    age: Joi.number().integer().min(4).max(130),
    isDeleted: Joi.boolean()
});

export const addGroupSchema = Joi.object({
    name: Joi.string().min(1).required(),
    permissions: Joi.array()
        .items(
            Joi.string().valid(
                'READ',
                'WRITE',
                'DELETE',
                'SHARE',
                'UPLOAD_FILES'
            )
        )
        .required()
});

export const updateGroupSchema = Joi.object({
    name: Joi.string().min(1),
    permissions: Joi.array().items(
        Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')
    )
});

export const addUsersToGroupSchema = Joi.object({
    userIds: Joi.array().min(1).required()
});

export function isBodyEmpty(body) {
    if (!Object.keys(body).length) {
        throw new Error('specify update values');
    }
}
