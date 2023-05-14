import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JoiValidationPipe } from '../common/pipes/joiValidation.pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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
  ) {
    const user: UserDocument = await this.usersService.findUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.usersService.updateUser(user, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user: UserDocument = await this.usersService.findUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const numUserDeleted = await this.usersService.deleteUser(id);
    return {
      statusCode: 200,
      message: `${numUserDeleted} user deleted`,
    };
  }
}
