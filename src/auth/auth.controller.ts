import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from '../common/pipes/joiValidation.pipe';
import { LoginDto, loginSchema } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body(new JoiValidationPipe(loginSchema)) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Get('refreshToken')
  refreshToken(@Req() req: Request) {
    const refreshToken: string = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', { httpOnly: true, maxAge: 30 * 1000 });
    return { statusCode: 200, message: 'Cookie cleared' };
  }
}
