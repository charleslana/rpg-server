import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { BusinessRuleException } from '@/helpers/error/business-rule-exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { CharacterClassEnum, GenderEnum, RoleEnum } from '@prisma/client';
import { formatDate } from '@/utils/utils';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedpassword',
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
  attribute: {
    id: 1,
    strength: 1,
    defense: 1,
    agility: 1,
    intelligence: 1,
    endurance: 1,
    spendPoint: 0,
    userId: 1,
  },
  statistic: {
    id: 1,
    honorVictories: 0,
    totalBattles: 0,
    battlesWon: 0,
    battlesLost: 0,
    battlesDraw: 0,
    damageDone: 0,
    damageSuffered: 0,
    goldWon: 0,
    goldLost: 0,
    arenaPoints: 0,
    userId: 1,
  },
  titles: [
    {
      id: 1,
      equipped: true,
      titleId: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: {
        id: 1,
        name: 'Test User',
      },
    },
  ],
};

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            findByNickname: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findAll: jest.fn(),
            findAllPaginatedAndFilter: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('deve criar um usuário com sucesso', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(repository, 'findByNickname').mockResolvedValue(null);
    jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.nickname = 'testuser';
    dto.password = 'password123';
    dto.gender = 'male';
    dto.hashPassword = jest.fn().mockResolvedValue('hashedpassword');

    const result = await service.create(dto);
    expect(result).toEqual(mockUser);
  });

  it('deve lançar erro ao tentar criar usuário com e-mail já existente', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(mockUser);

    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.nickname = 'testuser';
    dto.password = 'password123';

    await expect(service.create(dto)).rejects.toThrow(
      new BusinessRuleException('O e-mail do usuário já existe'),
    );
  });

  it('deve retornar um usuário pelo ID', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue(mockUser);

    const result = await service.get(1);
    expect(result).toEqual(mockUser);
  });

  it('deve lançar erro ao buscar usuário inexistente', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue(null);

    await expect(service.get(999)).rejects.toThrow(
      new BusinessRuleException('Usuário não encontrado'),
    );
  });

  it('deve atualizar a senha do usuário', async () => {
    const dto = new UpdateUserPasswordDto();
    dto.id = 1;
    dto.currentPassword = 'password123';
    dto.newPassword = 'newpassword';
    dto.decryptPassword = jest.fn().mockResolvedValue(true);
    dto.hashPassword = jest.fn().mockResolvedValue('newhashedpassword');

    jest.spyOn(service, 'get').mockResolvedValue(mockUser);
    jest
      .spyOn(repository, 'update')
      .mockResolvedValue({ ...mockUser, password: 'newhashedpassword' });

    const result = await service.updateUserPassword(dto);
    expect(result.password).toEqual('newhashedpassword');
  });

  it('deve lançar erro ao tentar atualizar a senha com senha atual inválida', async () => {
    const dto = new UpdateUserPasswordDto();
    dto.id = 1;
    dto.currentPassword = 'wrongpassword';
    dto.newPassword = 'newpassword';
    dto.decryptPassword = jest.fn().mockResolvedValue(false);

    jest.spyOn(service, 'get').mockResolvedValue(mockUser);

    await expect(service.updateUserPassword(dto)).rejects.toThrow(
      new BusinessRuleException('Senha do usuário atual inválida'),
    );
  });

  it('deve excluir um usuário', async () => {
    jest.spyOn(service, 'get').mockResolvedValue(mockUser);
    jest.spyOn(repository, 'delete').mockResolvedValue(mockUser);

    const result = await service.exclude(1);
    expect(result.message).toEqual('Usuário deletado com sucesso');
  });

  it('deve validar se um usuário está banido', () => {
    const bannedUser = {
      ...mockUser,
      bannedTime: new Date(Date.now() + 10000),
    };

    expect(() => service.validateUserBanned(bannedUser.bannedTime)).toThrow(
      new BusinessRuleException(
        `O usuário está banido até ${formatDate(bannedUser.bannedTime)}`,
        403,
      ),
    );
  });

  it('deve filtrar usuários com paginação', async () => {
    const pageDto = { page: 1, pageSize: 10 };
    const filterDto = { nickname: 'testuser' };
    jest.spyOn(repository, 'findAllPaginatedAndFilter').mockResolvedValue({
      results: [mockUser],
      pagination: {
        totalCount: 1,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
      },
    });

    const result = await service.filterUsersPaginated(pageDto, filterDto);
    expect(result.results.length).toBe(1);
    expect(result.results[0]).toEqual(mockUser);
  });

  it('deve retornar todos os usuários', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([mockUser]);

    const result = await service.getAll();
    expect(result).toEqual([mockUser]);
  });

  it('deve retornar usuário por email', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(mockUser);

    const result = await service.getUserByEmail('test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('deve atualizar o nickname do usuário', async () => {
    const dto = {
      userId: 1,
      nickname: 'newNickname',
      gender: GenderEnum.male,
      characterClass: CharacterClassEnum.attack,
      avatar: 'default',
    };
    jest.spyOn(service, 'get').mockResolvedValue(mockUser);
    jest.spyOn(repository, 'findByNickname').mockResolvedValue(null);
    jest.spyOn(repository, 'update').mockResolvedValue({
      ...mockUser,
      nickname: 'newNickname',
    });

    const result = await service.updateUserNickname(dto);
    expect(result.nickname).toEqual('newNickname');
  });

  it('deve lançar erro ao tentar atualizar nickname para existente', async () => {
    const dto = {
      userId: 1,
      nickname: 'testuser',
      gender: GenderEnum.male,
      characterClass: CharacterClassEnum.attack,
      avatar: 'default2',
    };
    jest.spyOn(service, 'get').mockResolvedValue(mockUser);
    jest.spyOn(repository, 'findByNickname').mockResolvedValue({
      ...mockUser,
      id: 2,
    });

    await expect(service.updateUserNickname(dto)).rejects.toThrow(
      new BusinessRuleException('Nome de personagem do usuário já existe'),
    );
  });

  it('deve retornar usuário pelo nome', async () => {
    jest.spyOn(repository, 'findByNickname').mockResolvedValue(mockUser);

    const result = await service.getUserByName('testuser');
    expect(result).toEqual(mockUser);
  });

  it('deve lançar erro ao tentar retornar usuário por nome inexistente', async () => {
    jest.spyOn(repository, 'findByNickname').mockResolvedValue(null);

    await expect(service.getUserByName('nonexistentuser')).rejects.toThrow(
      new BusinessRuleException('Usuário não encontrado pelo nome'),
    );
  });

  it('deve salvar um usuário com avatar correto para o gênero feminino', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.nickname = 'newNickname';
    dto.password = 'password123';
    dto.gender = 'female';
    dto.hashPassword = jest.fn().mockResolvedValue('hashedpassword');
    dto.decryptPassword = jest.fn().mockResolvedValue(true);

    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(repository, 'findByNickname').mockResolvedValue(null);
    jest.spyOn(repository, 'save').mockResolvedValue({
      ...dto,
      avatar: 'default2',
      bannedTime: null,
      id: 1,
      description: null,
      level: 1,
      gold: 200,
      credit: 0,
      emerald: 0,
      sapphire: 0,
      crystal: 0,
      diamond: 0,
      exp: 0,
      life: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const result = await service.create(dto);
    expect(result.avatar).toEqual('default2');
  });

  it('deve lançar erro ao tentar criar usuário com nickname já existente', async () => {
    const dto = new CreateUserDto();
    dto.email = 'newuser@example.com';
    dto.nickname = 'testuser';
    dto.password = 'password123';
    dto.hashPassword = jest.fn().mockResolvedValue('hashedpassword');

    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(repository, 'findByNickname').mockResolvedValue(mockUser);

    await expect(service.create(dto)).rejects.toThrow(
      new BusinessRuleException('O nickname do usuário já existe'),
    );
  });
});
