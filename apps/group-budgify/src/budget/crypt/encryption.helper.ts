import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptionHelper {
  private readonly PASSWORD = 'Password used to generate key';
  private readonly BYTES = 16;
  private readonly ALGORITHM = 'aes-256-ctr';
  private readonly STRING_ENCODING = 'base64';

  async encrypt(textToEncrypt: string): Promise<string> {
    const iv = randomBytes(this.BYTES);

    const key = (await promisify(scrypt)(this.PASSWORD, 'salt', 32)) as Buffer;
    const cipher = createCipheriv(this.ALGORITHM, key, iv);

    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    // Concatenate the iv with the encrypted text for later use in decryption
    const result = Buffer.concat([iv, encryptedText]);

    return result.toString(this.STRING_ENCODING);
  }

  async decrypt(textToDecrypt: string): Promise<string> {
    const key = (await promisify(scrypt)(this.PASSWORD, 'salt', 32)) as Buffer;

    // Extract the iv from the first BYTES bytes of the base64-encoded string
    const iv = Buffer.from(textToDecrypt, this.STRING_ENCODING).slice(
      0,
      this.BYTES,
    );
    const encryptedText = Buffer.from(
      textToDecrypt,
      this.STRING_ENCODING,
    ).slice(this.BYTES);

    const decipher = createDecipheriv(this.ALGORITHM, key, iv);

    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }
}
