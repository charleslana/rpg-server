import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/database/prisma.service';
import { UserRepository } from './user.repository';
import { CharacterClassEnum, GenderEnum, Prisma } from '@prisma/client';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve criar um usuário', async () => {
    const userInput: Prisma.UserCreateInput = {
      email: 'test@example.com',
      nickname: 'testuser',
      password: 'hashedpassword',
      name: 'Test',
      gender: GenderEnum.male,
      characterClass: CharacterClassEnum.attack,
      avatar: '',
    };

    const mockUser = { id: 1, ...userInput };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.save({ data: userInput });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining(userInput),
    });
    expect(result).toEqual(mockUser);
  });

  it('deve buscar um usuário por e-mail', async () => {
    const mockUser = { id: 1, email: 'test@example.com', roles: [] };
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.findByEmail('test@example.com');

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: { contains: 'test@example.com', mode: 'insensitive' } },
      include: { roles: true },
    });
    expect(result).toEqual(mockUser);
  });

  it('deve buscar um usuário por nickname', async () => {
    const mockUser = { id: 1, nickname: 'testuser' };
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.findByNickname('testuser');

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { nickname: { equals: 'testuser', mode: 'insensitive' } },
    });
    expect(result).toEqual(mockUser);
  });

  it('deve buscar um usuário por ID', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.findById(1);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockUser);
  });

  it('deve buscar todos os usuários paginados', async () => {
    const mockUsers = [{ id: 1, nickname: 'testuser' }];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    (prisma.user.count as jest.Mock).mockResolvedValue(1);

    const result = await repository.findAllPaginatedAndFilter({
      page: { page: 1, pageSize: 10 },
    });

    expect(prisma.user.count).toHaveBeenCalled();
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
      }),
    );
    expect(result.results).toEqual(mockUsers);
  });

  it('deve atualizar um usuário', async () => {
    const mockUser = { id: 1, nickname: 'updatedUser' };
    (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.update({
      where: { id: 1 },
      data: { nickname: 'updatedUser' },
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nickname: 'updatedUser' },
    });
    expect(result).toEqual(mockUser);
  });

  it('deve deletar um usuário', async () => {
    const mockUser = { id: 1 };
    (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.delete({ where: { id: 1 } });

    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockUser);
  });

  it('deve encontrar um usuário por ID com relações', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      attribute: {},
      statistic: {},
      titles: [{ title: { id: 1, name: 'Title 1' }, equipped: true }],
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await repository.find({ id: 1 });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        attribute: true,
        statistic: true,
        titles: { where: { equipped: true }, include: { title: true } },
      },
    });
    expect(result).toEqual(mockUser);
  });

  it('deve retornar todos os usuários com filtros e paginação', async () => {
    const mockUsers = [{ id: 1, nickname: 'testuser' }];
    const where = { level: { gte: 5 } };
    const orderBy = [
      { level: 'desc' },
      { id: 'desc' },
    ] as Prisma.UserOrderByWithRelationInput;
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    // TODO implementar em todos os testes o spy
    // const findManySpy = jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockUsers);

    const result = await repository.findAll({
      skip: 0,
      take: 10,
      where,
      orderBy,
    });

    // TODO deve alterar o expext pelo spy (findManySpy)
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      where,
      orderBy: [{ level: 'desc' }, { id: 'desc' }],
    });
    expect(result).toEqual(mockUsers);
  });

  it('deve retornar usuários paginados com filtro de nickname', async () => {
    const mockUsers = [{ id: 1, nickname: 'testuser' }];
    (prisma.user.count as jest.Mock).mockResolvedValue(1);
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const result = await repository.findAllPaginatedAndFilter({
      page: { page: 1, pageSize: 10 },
      nickname: 'testuser',
    });

    expect(prisma.user.count).toHaveBeenCalledWith({
      where: { nickname: { contains: 'testuser', mode: 'insensitive' } },
    });
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      where: { nickname: { contains: 'testuser', mode: 'insensitive' } },
      orderBy: [{ level: 'desc' }, { id: 'desc' }],
      include: {
        attribute: true,
        statistic: true,
      },
    });
    expect(result.results).toEqual(mockUsers);
  });
});
