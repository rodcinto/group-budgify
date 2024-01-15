import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashHelper } from '../crypt/hash.helper';

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

    const hashPassword = await HashHelper.hash(
      userGivenInput.password as string,
    );
    userModifiedInput = {
      ...userGivenInput,
      password: hashPassword,
    };

    return userModifiedInput;
  }
}
