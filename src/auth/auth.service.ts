import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/schemas/user.schema';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, res: Response) {
    const user: UserDocument = await this.usersService.findUserByUsername(
      loginDto.username,
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const matchPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!matchPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    res.cookie(
      'refreshToken',
      await this.jwtService.signAsync({ username: user.username }),
      { httpOnly: true, maxAge: 15 * 60 * 1000 },
    );
    return {
      accessToken: await this.jwtService.signAsync(
        { username: user.username, roles: user.roles },
        {
          expiresIn: '20s',
        },
      ),
    };
  }
}
