import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { FindOneParams } from '@/modules/find-one.params';
import { Request } from 'express';
import { CharacterClassEnum, GenderEnum } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthCookieGuard } from '@/modules/auth/auth.cookie.guard';
import { SocketRoomService } from '@/modules/socket/socket.room.service';
import { SocketUserService } from '@/modules/socket/socket.user.service';
import { UserSocketExistsGuard } from '@/modules/auth/user.socket.exists.guard';

const mockUserService = {
  create: jest.fn(),
  getAll: jest.fn(),
  get: jest.fn(),
  exclude: jest.fn(),
  updateUserPassword: jest.fn(),
  updateUserNickname: jest.fn(),
  filterUsersPaginated: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mocked_token'),
};

const mockAuthCookieGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};

const mockSocketUserService = {
  findUserBySocketId: jest.fn(),
};

const mockSocketRoomService = {
  findRoomBySocketId: jest.fn(),
};

const mockUserSocketExistsGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        { provide: SocketUserService, useValue: mockSocketUserService },
        { provide: SocketRoomService, useValue: mockSocketRoomService },
      ],
    })
      .overrideGuard(AuthCookieGuard)
      .useValue(mockAuthCookieGuard)
      .overrideGuard(UserSocketExistsGuard)
      .useValue(mockUserSocketExistsGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve criar um usuário', async () => {
    const dto: CreateUserDto = {
      avatar: '',
      characterClass: CharacterClassEnum.attack,
      gender: GenderEnum.male,
      name: '',
      nickname: '',
      email: 'test@example.com',
      password: '123456',
      hashPassword: jest.fn(),
      decryptPassword: jest.fn().mockResolvedValue(true),
    };
    const mockUser = { id: 1, ...dto };
    mockUserService.create.mockResolvedValue(mockUser);

    expect(
      await controller.createUser(dto, { url: '/user' } as Request),
    ).toEqual(mockUser);
  });

  it('deve retornar todos os usuários', async () => {
    const users = [{ id: 1, email: 'test@example.com' }];
    mockUserService.getAll.mockResolvedValue(users);

    expect(await controller.getUsers({ url: '/user' } as Request)).toEqual(
      users,
    );
  });

  it('deve retornar um usuário pelo ID', async () => {
    const user = { id: 1, email: 'test@example.com' };
    mockUserService.get.mockResolvedValue(user);

    expect(
      await controller.getUser(
        { id: 1 } as FindOneParams,
        { url: '/user/1' } as Request,
      ),
    ).toEqual(user);
  });

  it('deve excluir um usuário', async () => {
    mockUserService.exclude.mockResolvedValue({
      statusCode: 200,
      toJson: () => ({ message: 'Usuário deletado' }),
    });
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await controller.deleteUser(
      { id: 1 } as FindOneParams,
      response as any,
      { url: '/user/1' } as Request,
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ message: 'Usuário deletado' });
  });

  it('deve atualizar a senha do usuário', async () => {
    const dto: UpdateUserPasswordDto = {
      id: 1,
      currentPassword: 'currentPassword',
      newPassword: 'newpassword',
      hashPassword: jest.fn(),
      decryptPassword: jest.fn().mockResolvedValue(true),
    };
    const updatedUser = { id: 1, email: 'test@example.com' };
    mockUserService.updateUserPassword.mockResolvedValue(updatedUser);

    expect(
      await controller.updateUserPassword(dto, {
        user: { sub: 1 },
        url: '/user/change-password',
      } as Request),
    ).toEqual(updatedUser);
  });

  it('deve atualizar o nickname do usuário', async () => {
    const dto: UpdateUserDto = {
      avatar: '',
      characterClass: CharacterClassEnum.attack,
      gender: GenderEnum.male,
      userId: 1,
      nickname: 'newnickname',
    };
    const updatedUser = { id: 1, email: 'test@example.com' };
    mockUserService.updateUserNickname.mockResolvedValue(updatedUser);

    expect(
      await controller.updateNickname(dto, {
        user: { sub: 1 },
        url: '/user/change-nickname',
      } as Request),
    ).toEqual(updatedUser);
  });

  it('deve filtrar usuários paginados', async () => {
    const filterDto: FilterUserDto = { nickname: 'test' };
    const page = { page: 1, pageSize: 10 };
    const paginatedUsers = { data: [{ id: 1, email: 'test@example.com' }] };
    mockUserService.filterUsersPaginated.mockResolvedValue(paginatedUsers);

    expect(
      await controller.filterUsersPaginated(page, filterDto, {
        url: '/user/filter',
      } as Request),
    ).toEqual(paginatedUsers);
  });

  it('deve retornar o usuário logado', async () => {
    const loggedUser = { id: 1, email: 'test@example.com' };

    mockUserService.get.mockResolvedValue(loggedUser);

    const request = {
      user: { sub: 1 },
      url: '/user/me',
    } as Request;

    expect(await controller.getMe(request)).toEqual(loggedUser);
  });
});
