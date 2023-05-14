import * as Joi from 'joi';

export interface CreateUserDto {
  username: string;
  password: string;
  roles: string[];
}

export const createUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  roles: Joi.array().items(Joi.string().valid('Admin', 'User')),
});
