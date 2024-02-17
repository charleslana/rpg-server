import { PrismaClient, UserCharacter } from '@prisma/client';

const prisma = new PrismaClient();

export class UserCharacterRepository {
  public async save(data: UserCharacter): Promise<UserCharacter> {
    return await prisma.userCharacter.create({
      data,
    });
  }

  public async update(id: number, data: Partial<UserCharacter>): Promise<UserCharacter | null> {
    return await prisma.userCharacter.update({
      where: { id },
      data,
    });
  }

  public async findAll(): Promise<UserCharacter[]> {
    return await prisma.userCharacter.findMany();
  }

  public async findAllByUserId(userId: number): Promise<UserCharacter[]> {
    return await prisma.userCharacter.findMany({
      where: { userId },
    });
  }

  public async findById(id: number): Promise<UserCharacter | null> {
    return await prisma.userCharacter.findUnique({
      where: { id },
    });
  }

  public async findByIdAndUserId(id: number, userId: number): Promise<UserCharacter | null> {
    return await prisma.userCharacter.findUnique({
      where: { id, userId },
    });
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await prisma.userCharacter.delete({
      where: { id },
    });
    return !!deleted;
  }

  public async countByUserId(userId: number): Promise<number> {
    return await prisma.userCharacter.count({
      where: { userId },
    });
  }
}
