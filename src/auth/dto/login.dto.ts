import * as Joi from 'joi';

export interface LoginDto {
  username: string;
  password: string;
}

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
