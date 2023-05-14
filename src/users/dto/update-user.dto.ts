import * as Joi from 'joi';

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
