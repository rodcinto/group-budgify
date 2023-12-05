import { Injectable, PipeTransform } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BcryptDecorator } from '../crypt/bcrypt.decorator';

@Injectable()
export class PasswordPipe implements PipeTransform {
  async transform(
    userCreateInput: Prisma.UserCreateInput,
  ): Promise<Prisma.UserCreateInput> {
    const hashPassword = await BcryptDecorator.hash(userCreateInput.password);

    const modifiedValue: Prisma.UserCreateInput = {
      ...userCreateInput,
      password: hashPassword,
    };

    return modifiedValue;
  }
}
