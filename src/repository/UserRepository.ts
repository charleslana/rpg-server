import { IUser } from 'interface/IUser';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  public async save(data: User): Promise<User> {
    return await prisma.user.create({
      data: {
        ...data,
        roles: {
          create: {
            name: 'user',
          },
        },
        userCharacters: {
          createMany: {
            data: [
              {
                characterId: 1,
                slot: 1,
              },
              {
                characterId: 2,
                slot: 2,
              },
              {
                characterId: 3,
                slot: 3,
              },
            ],
          },
        },
      },
    });
  }

  public async update(id: number, data: Partial<User>): Promise<IUser | null> {
    return await prisma.user.update({
      where: { id },
      data,
      include: {
        roles: true,
      },
    });
  }

  public async findAll(): Promise<IUser[]> {
    return await prisma.user.findMany({
      include: {
        roles: true,
      },
    });
  }

  public async findById(id: number): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    const emailLowerCase = email.toLowerCase();
    return await prisma.user.findUnique({
      where: { email: emailLowerCase },
    });
  }

  public async findByName(name: string): Promise<User | null> {
    const nameLowerCase = name.toLowerCase();
    return await prisma.user.findFirst({
      where: {
        name: {
          startsWith: nameLowerCase,
          mode: 'insensitive',
        },
      },
    });
  }

  public async findByAuthToken(id: number, authToken: string | null): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        authToken,
        id,
      },
    });
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await prisma.user.delete({
      where: { id },
    });
    return !!deleted;
  }
}
