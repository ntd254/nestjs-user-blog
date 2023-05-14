import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { JoiValidationPipe } from '../common/pipes/joiValidation.pipe';
import { CreateBlogDto, createBlogSchema } from './dto/create-blog.dto';
import { UsersService } from '../users/users.service';
import { UpdateBlogDto, updateBlogSchema } from './dto/update-blog.dto';
import { BlogDocument } from './schemas/blog.schema';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getAllBlogs() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  async getBlog(@Param('id') id: string) {
    const blog = await this.blogsService.findBlog(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  @Post()
  async createBlog(
    @Body(new JoiValidationPipe(createBlogSchema)) createBlogDto: CreateBlogDto,
  ) {
    const author = await this.usersService.findUser(createBlogDto.author);
    if (!author) {
      throw new BadRequestException('Author not found');
    }
    return await this.blogsService.create(createBlogDto);
  }

  @Put(':id')
  async updateBlog(
    @Body(new JoiValidationPipe(updateBlogSchema)) updateBlogDto: UpdateBlogDto,
    @Param('id') id: string,
  ) {
    const blog: BlogDocument = await this.blogsService.findBlog(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return await this.blogsService.updateBlog(blog, updateBlogDto);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    const blog: BlogDocument = await this.blogsService.findBlog(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    const numBlogDeleted = await this.blogsService.deleteBlog(id);
    return { statusCode: 200, message: `${numBlogDeleted} blog deleted` };
  }
}
