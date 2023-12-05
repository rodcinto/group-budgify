import { Injectable, PipeTransform } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class PasswordPipe implements PipeTransform {
  async transform(
    userCreateInput: Prisma.UserCreateInput,
  ): Promise<Prisma.UserCreateInput> {
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(
      userCreateInput.password,
      saltOrRounds,
    );

    const modifiedValue: Prisma.UserCreateInput = {
      ...userCreateInput,
      password: hashPassword,
    };

    return modifiedValue;
  }
}
