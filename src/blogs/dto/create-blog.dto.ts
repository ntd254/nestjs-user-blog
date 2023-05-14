import * as Joi from 'joi';

export interface CreateBlogDto {
  title: string;
  content: string;
  author: string;
}

export const createBlogSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  author: Joi.string().required(),
});
