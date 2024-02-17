import { Character, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CharacterRepository {
  public async save(data: Character): Promise<Character> {
    return await prisma.character.create({
      data,
    });
  }

  public async update(id: number, data: Partial<Character>): Promise<Character | null> {
    return await prisma.character.update({
      where: { id },
      data,
    });
  }

  public async findAll(): Promise<Character[]> {
    return await prisma.character.findMany();
  }

  public async findById(id: number): Promise<Character | null> {
    return await prisma.character.findUnique({
      where: { id },
    });
  }

  public async findByName(name: string): Promise<Character | null> {
    const nameLowerCase = name.toLowerCase();
    return await prisma.character.findFirst({
      where: {
        name: {
          startsWith: nameLowerCase,
          mode: 'insensitive',
        },
      },
    });
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await prisma.character.delete({
      where: { id },
    });
    return !!deleted;
  }
}
