import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JoiValidationPipe } from '../common/pipes/joiValidation.pipe';
import {
  CreateUserDto,
  createUserSchema,
  UpdateUserDto,
  updateUserSchema,
} from './dto/user.dto';
import { Response } from 'express';
import { UserDocument } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'User not found' });
    }
    return res.json(user);
  }

  @Post()
  createUser(
    @Body(new JoiValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Body(new JoiValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const user: UserDocument = await this.usersService.findOne(id);
    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'User not found' });
    }
    user.username = updateUserDto.username || user.username;
    user.password = updateUserDto.password || user.password;
    user.roles = updateUserDto.roles || user.roles;
    return res.json(await this.usersService.updateOne(user));
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const user: UserDocument = await this.usersService.findOne(id);
    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'User not found' });
    }
    const numUserDeleted = await this.usersService.deleteOne(id);
    return res.json({
      statusCode: 200,
      message: `${numUserDeleted} user deleted`,
    });
  }
}
