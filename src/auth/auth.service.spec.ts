import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { john } from '../users/personas';
import { UsersService } from '../users/users.service';
import { Encryption } from './crypt/encryption';

describe('AuthService', () => {
  let authService: AuthService;
  let mockedJwtService: DeepMockProxy<JwtService>;
  let mockedUsersService: DeepMockProxy<UsersService>;
  let decoratedJohn;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    })
      .overrideProvider(UsersService)
      .useValue(mockDeep<UsersService>())
      .overrideProvider(JwtService)
      .useValue(mockDeep<JwtService>())
      .compile();

    authService = module.get<AuthService>(AuthService);
    mockedJwtService = module.get(JwtService);
    mockedUsersService = module.get(UsersService);

    decoratedJohn = {
      id: 1,
      ...john,
      password: await Encryption.hash(john.password),
    };
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should login for John', async () => {
    mockedJwtService.sign.mockResolvedValue('THIS IS A TOKEN' as never);
    const loginResult = await authService.login(decoratedJohn);

    expect(loginResult).toHaveProperty('accessToken');
    expect(loginResult).toHaveProperty('refreshToken');
    expect(mockedJwtService.sign).toHaveBeenCalledTimes(2);
  });

  it('should verifyAuthentication', async () => {
    mockedUsersService.findOneByEmail.mockResolvedValue(decoratedJohn);

    const verificationResult = await authService.verifyAuthentication(
      john.email,
      john.password,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeJohn } = decoratedJohn;

    expect(verificationResult).toMatchObject(safeJohn);
  });
});
