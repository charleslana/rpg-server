import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
            validateUserBanned: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked_jwt_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve ser definido', () => {
    expect(authService).toBeDefined();
  });

  it('deve retornar um token JWT válido ao fazer login', async () => {
    const authDto: AuthDto = {
      email: 'test@email.com',
      password: 'password123',
      hashPassword: jest.fn(),
      decryptPassword: jest.fn().mockResolvedValue(true),
    };

    const mockUser = {
      id: 1,
      email: 'test@email.com',
      password: 'hashedPassword',
      roles: [],
      bannedTime: null,
    };

    (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    const result = await authService.signIn(authDto);

    expect(result).toEqual({ access_token: 'mocked_jwt_token' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
      roles: [],
    });
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);

    const authDto: AuthDto = {
      email: 'wrong@email.com',
      password: 'password123',
      hashPassword: jest.fn(),
      decryptPassword: jest.fn(),
    };

    await expect(authService.signIn(authDto)).rejects.toThrow(
      new UnauthorizedException('Credenciais inválidas'),
    );
  });

  it('deve lançar erro se a senha estiver incorreta', async () => {
    const mockUser = {
      id: 1,
      email: 'test@email.com',
      password: 'hashedPassword',
      roles: [],
      bannedTime: null,
    };

    (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    //(userService.getUserByEmail as jest.Mock).mockRejectedValue(new Error('Erro ao buscar usuário'));

    const authDto: AuthDto = {
      email: 'test@email.com',
      password: 'wrongPassword',
      hashPassword: jest.fn(),
      decryptPassword: jest.fn().mockResolvedValue(false),
    };

    // authDto.decryptPassword = jest.fn().mockRejectedValue(new Error('Erro ao validar senha'));

    await expect(authService.signIn(authDto)).rejects.toThrow(
      new UnauthorizedException('Usuário ou senha inválida'),
    );
  });

  it('deve validar se o usuário está banido', async () => {
    const mockUser = {
      id: 1,
      email: 'test@email.com',
      password: 'hashedPassword',
      roles: [],
      bannedTime: new Date(),
    };

    (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    const authDto: AuthDto = {
      email: 'test@email.com',
      password: 'password123',
      hashPassword: jest.fn(),
      decryptPassword: jest.fn().mockResolvedValue(true),
    };

    (userService.validateUserBanned as jest.Mock).mockImplementation(() => {
      throw new UnauthorizedException('Usuário banido');
    });

    await expect(authService.signIn(authDto)).rejects.toThrow(
      new UnauthorizedException('Usuário banido'),
    );
  });
});
