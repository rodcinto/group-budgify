import * as bcrypt from 'bcrypt';

export class BcryptDecorator {
  private static readonly SALT_OR_ROUNDS = 10;

  static hash(stringValue: string): Promise<string> {
    return bcrypt.hash(stringValue, BcryptDecorator.SALT_OR_ROUNDS);
  }

  static compare(given: string, expected: string): Promise<boolean> {
    return bcrypt.compare(given, expected);
  }
}
