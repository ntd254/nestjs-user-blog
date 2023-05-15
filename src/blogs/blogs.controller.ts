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
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { JoiValidationPipe } from '../common/pipes/joiValidation.pipe';
import { CreateBlogDto, createBlogSchema } from './dto/create-blog.dto';
import { UsersService } from '../users/users.service';
import { UpdateBlogDto, updateBlogSchema } from './dto/update-blog.dto';
import { BlogDocument } from './schemas/blog.schema';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('blogs')
@UseGuards(AuthGuard, RolesGuard)
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Roles('Admin', 'User')
  getAllBlogs() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  @Roles('Admin, User')
  async getBlog(@Param('id') id: string) {
    const blog = await this.blogsService.findBlog(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  @Post()
  @Roles('Admin')
  async createBlog(
    @Body(new JoiValidationPipe(createBlogSchema)) createBlogDto: CreateBlogDto,
  ) {
    const author = await this.usersService.findUserById(createBlogDto.author);
    if (!author) {
      throw new BadRequestException('Author not found');
    }
    return await this.blogsService.create(createBlogDto);
  }

  @Put(':id')
  @Roles('Admin')
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
  @Roles('Admin')
  async deleteBlog(@Param('id') id: string) {
    const blog: BlogDocument = await this.blogsService.findBlog(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    const numBlogDeleted = await this.blogsService.deleteBlog(id);
    return { statusCode: 200, message: `${numBlogDeleted} blog deleted` };
  }
}
