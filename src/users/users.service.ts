import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findAll() {
    return this.userModel.find().exec();
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return this.userModel.create(createUserDto);
  }

  findUserById(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  findUserByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async updateUser(user: UserDocument, updateUserDto: UpdateUserDto) {
    user.username = updateUserDto.username || user.username;
    user.roles = updateUserDto.roles || user.roles;
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return user.save();
  }

  async deleteUser(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    return deletedCount;
  }
}
