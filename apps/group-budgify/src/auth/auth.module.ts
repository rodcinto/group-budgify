import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';

@Module({
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtGuard,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class AuthModule {}
