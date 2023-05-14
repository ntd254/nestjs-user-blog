import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findAll() {
    return this.userModel.find().exec();
  }

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findUser(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  updateUser(user: UserDocument, updateUserDto: UpdateUserDto) {
    user.username = updateUserDto.username || user.username;
    user.password = updateUserDto.password || user.password;
    user.roles = updateUserDto.roles || user.roles;
    return user.save();
  }

  async deleteUser(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    return deletedCount;
  }
}
