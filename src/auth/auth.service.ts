import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { BcryptDecorator } from './crypt/bcrypt.decorator';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verifyAuthentication(
    username: string,
    password: string,
  ): Promise<SafeUser | null> {
    const user = await this.usersService.findOneByEmail(username);

    if (user === null) return null;

    if (await BcryptDecorator.compare(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.email,
      sub: {
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: User) {
    const payload = {
      username: user.email,
      sub: {
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
