import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('deve ser definido', () => {
    expect(authController).toBeDefined();
  });

  it('deve retornar um token ao fazer login', async () => {
    const authDto: AuthDto = {
      email: 'test@email.com',
      password: 'password123',
      hashPassword: jest.fn(),
      decryptPassword: jest.fn().mockResolvedValue(true),
    };

    (authService.signIn as jest.Mock).mockResolvedValue({
      access_token: 'mocked_jwt_token',
    });

    const result = await authController.signIn(authDto, {
      url: '/auth/login',
    } as any);

    expect(result).toEqual({ access_token: 'mocked_jwt_token' });
    expect(authService.signIn).toHaveBeenCalledWith(authDto);
  });

  it('deve retornar erro se as credenciais forem inválidas', async () => {
    const authDto: AuthDto = {
      email: 'wrong@email.com',
      password: 'wrongPassword',
      hashPassword: jest.fn(),
      decryptPassword: jest.fn().mockResolvedValue(true),
    };

    (authService.signIn as jest.Mock).mockRejectedValue(
      new UnauthorizedException('Credenciais inválidas'),
    );

    await expect(
      authController.signIn(authDto, { url: '/auth/login' } as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve retornar um cookie ao fazer login com signInWithCookie', async () => {
    const authDto: AuthDto = {
      email: 'test@email.com',
      password: 'password123',
      hashPassword: jest.fn(),
      decryptPassword: jest.fn().mockResolvedValue(true),
    };

    (authService.signIn as jest.Mock).mockResolvedValue({
      access_token: 'mocked_jwt_token',
    });

    const res = {
      cookie: jest.fn(),
      json: jest.fn().mockReturnValue({ message: 'Login bem-sucedido' }),
    };

    const result = await authController.signInWithCookie(
      authDto,
      { url: '/auth/v2/login' } as any,
      res as any,
    );

    expect(res.cookie).toHaveBeenCalledWith(
      'access_token',
      'mocked_jwt_token',
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      }),
    );

    expect(result).toEqual({ message: 'Login bem-sucedido' });
  });
});
