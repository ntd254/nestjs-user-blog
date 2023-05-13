import * as Joi from 'joi';

export interface CreateUserDto {
  username: string;
  password: string;
  roles: string[];
}

export const createUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  roles: Joi.array().items(Joi.string().valid('Admin', 'User')).required(),
});

export interface UpdateUserDto {
  username?: string;
  password?: string;
  roles?: string[];
}

export const updateUserSchema = Joi.object({
  username: Joi.string(),
  password: Joi.string(),
  roles: Joi.array().items(Joi.string().valid('Admin', 'User')),
}).or('username', 'password', 'roles');
