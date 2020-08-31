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
