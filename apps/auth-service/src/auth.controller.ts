import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { Public } from 'src/decorators/public.decorator';
import {
  type AuthenticatedUser,
  CurrentUser,
} from 'src/decorators/current-user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('auth')
@UseGuards(JwtGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  validateToken(data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}
