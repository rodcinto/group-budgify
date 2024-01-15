import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionHelper } from './encryption.helper';

describe('Encryption Helper', () => {
  let encryptionHelper: EncryptionHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionHelper],
    }).compile();

    encryptionHelper = module.get<EncryptionHelper>(EncryptionHelper);
  });

  it('encrypt', async () => {
    const text: string = 'I am a secret text';
    const encryptedText = await encryptionHelper.encrypt(text);

    expect(encryptedText).not.toEqual(text);
  });

  it('decrypt', async () => {
    const text: string = '8';
    const encryptedText = await encryptionHelper.encrypt(text);

    const decryptedText = await encryptionHelper.decrypt(encryptedText);

    expect(decryptedText).toEqual(text);
  });
});
