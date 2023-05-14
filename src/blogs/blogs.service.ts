import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  findAll() {
    return this.blogModel.find().populate('author').exec();
  }

  create(createBlogDto: CreateBlogDto) {
    return this.blogModel.create(createBlogDto);
  }

  findBlog(id: string) {
    return this.blogModel.findOne({ _id: id }).populate('author').exec();
  }

  updateBlog(blog: BlogDocument, updateBlogDto: UpdateBlogDto) {
    blog.title = updateBlogDto.title || blog.title;
    blog.content = updateBlogDto.content || blog.content;
    return blog.save();
  }

  async deleteBlog(id: string) {
    const { deletedCount } = await this.blogModel.deleteOne({ _id: id });
    return deletedCount;
  }
}
