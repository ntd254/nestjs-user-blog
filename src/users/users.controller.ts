import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JoiValidationPipe } from '../common/pipes/joiValidation.pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('Admin', 'User')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'User')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  @Roles('Admin')
  async createUser(
    @Body(new JoiValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    const existedUser = await this.usersService.findUserByUsername(
      createUserDto.username,
    );
    if (existedUser) {
      throw new ConflictException('Duplicate username');
    }
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Roles('Admin')
  async updateUser(
    @Body(new JoiValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ) {
    const user: UserDocument = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.usersService.updateUser(user, updateUserDto);
  }

  @Delete(':id')
  @Roles('Admin')
  async deleteUser(@Param('id') id: string) {
    const user: UserDocument = await this.usersService.findUserById(id);
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
