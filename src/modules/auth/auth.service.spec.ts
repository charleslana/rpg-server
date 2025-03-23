import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CharacterClassEnum, GenderEnum, RoleEnum } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    bannedTime: null,
    name: 'Test User',
    nickname: 'testuser',
    gender: GenderEnum.male,
    avatar: 'default',
    characterClass: CharacterClassEnum.attack,
    level: 1,
    gold: 200,
    credit: 0,
    emerald: 0,
    sapphire: 0,
    crystal: 0,
    diamond: 0,
    exp: 0,
    life: 100,
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [
      {
        id: 1,
        name: RoleEnum.user,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

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
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar um token ao fazer login com credenciais válidas', async () => {
    const authDto = new AuthDto();
    authDto.email = 'test@example.com';
    authDto.password = 'plainPassword';
    authDto.decryptPassword = jest.fn().mockResolvedValue(true);

    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedToken');

    const result = await service.signIn(authDto);
    expect(result.access_token).toBe('mockedToken');
  });

  it('deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
    const authDto = new AuthDto();
    authDto.email = 'notfound@example.com';
    authDto.password = 'plainPassword';

    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);

    await expect(service.signIn(authDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve lançar UnauthorizedException se a senha estiver incorreta', async () => {
    const authDto = new AuthDto();
    authDto.email = 'test@example.com';
    authDto.password = 'wrongPassword';
    authDto.decryptPassword = jest.fn().mockResolvedValue(false);

    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(mockUser);

    await expect(service.signIn(authDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve validar se o usuário está banido antes de gerar o token', async () => {
    const authDto = new AuthDto();
    authDto.email = 'test@example.com';
    authDto.password = 'plainPassword';
    authDto.decryptPassword = jest.fn().mockResolvedValue(true);

    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(mockUser);
    jest.spyOn(userService, 'validateUserBanned').mockImplementation(() => {});
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedToken');

    const result = await service.signIn(authDto);

    expect(userService.validateUserBanned).toHaveBeenCalledWith(
      mockUser.bannedTime,
    );
    expect(result.access_token).toBe('mockedToken');
  });
});
