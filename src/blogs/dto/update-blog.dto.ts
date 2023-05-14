import * as Joi from 'joi';

export interface UpdateBlogDto {
  title?: string;
  content?: string;
}

export const updateBlogSchema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
}).or('title', 'content');
