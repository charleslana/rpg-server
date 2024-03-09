import HandlerError from 'handler/HandlerError';
import HandlerSuccess from 'handler/HandlerSuccess';
import { IGetUserCharacter } from 'interface/IUserCharacter';
import { UserCharacter } from '@prisma/client';
import { UserCharacterRepository } from 'repository/UserCharacterRepository';

export class UserCharacterService {
  private repository = new UserCharacterRepository();

  public async create(characterId: number): Promise<UserCharacter> {
    return await this.repository.save({
      characterId,
    } as UserCharacter);
  }

  public async update(dto: UserCharacter): Promise<UserCharacter | null> {
    return await this.repository.update(dto.id, dto);
  }

  public async getByIdAndUserId(id: number, userId: number): Promise<IGetUserCharacter> {
    const find = await this.repository.findByIdAndUserId(id, userId);
    if (!find) {
      throw new HandlerError('Personagem do usuário não encontrado');
    }
    const findMapped: IGetUserCharacter = {
      id: find.id,
      level: find.level,
      strength: find.strength,
      intelligence: find.intelligence,
      dexterity: find.dexterity,
      experience: find.experience,
      experienceMax: this.calculateExperienceMax(find),
      attributePoint: find.attributePoint,
      attributePointUsed: find.attributePointUsed,
      pointsAvailable: this.calculateAttributePointAvailable(find),
      slot: find.slot,
      createdAt: find.createdAt,
      character: {
        id: find.character.id,
        name: find.character.name,
        description: find.character.description,
        characterClass: find.character.characterClass,
      },
    };
    return findMapped;
  }

  public async getAllByUserId(userId: number): Promise<IGetUserCharacter[]> {
    const findAll = await this.repository.findAllByUserId(userId);
    const findAllMapped: IGetUserCharacter[] = findAll.map(find => ({
      id: find.id,
      level: find.level,
      strength: find.strength,
      intelligence: find.intelligence,
      dexterity: find.dexterity,
      experience: find.experience,
      experienceMax: this.calculateExperienceMax(find),
      attributePoint: find.attributePoint,
      attributePointUsed: find.attributePointUsed,
      pointsAvailable: this.calculateAttributePointAvailable(find),
      slot: find.slot,
      createdAt: find.createdAt,
      character: {
        id: find.character.id,
        name: find.character.name,
        description: find.character.description,
        characterClass: find.character.characterClass,
      },
    }));
    return findAllMapped;
  }

  public async deleteByIdAndUserId(id: number, userId: number): Promise<HandlerSuccess> {
    await this.getByIdAndUserId(id, userId);
    const count = await this.repository.countByUserId(userId);
    if (count <= 1) {
      throw new HandlerError('Você não pode excluir o único personagem em sua conta');
    }
    await this.repository.delete(id);
    return new HandlerSuccess('Personagem excluído com sucesso');
  }

  private calculateAttributePointAvailable(data: UserCharacter): number {
    return 2 * data.level - data.attributePointUsed + data.attributePoint;
  }

  private calculateExperienceMax(data: UserCharacter): number {
    return 5 * data.level;
  }
}
