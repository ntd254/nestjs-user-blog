import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findAll() {
    return this.userModel.find().exec();
  }

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  updateOne(user: UserDocument) {
    return user.save();
  }

  async deleteOne(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    return deletedCount;
  }
}
