import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from 'src/guards/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, Reflector],
})
export class AuthModule {}
