import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Encryption } from '../crypt/encryption';

type PrismaUserInput = Prisma.UserCreateInput | Prisma.UserUpdateInput;

@Injectable()
export class PasswordPipe implements PipeTransform {
  async transform(
    userGivenInput: PrismaUserInput,
    metadata: ArgumentMetadata,
  ): Promise<PrismaUserInput> {
    if (metadata.type !== 'body') {
      return userGivenInput;
    }

    let userModifiedInput: PrismaUserInput = userGivenInput;

    const hashPassword = await Encryption.hash(
      userGivenInput.password as string,
    );
    userModifiedInput = {
      ...userGivenInput,
      password: hashPassword,
    };

    return userModifiedInput;
  }
}
