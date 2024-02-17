import HandlerError from 'handler/HandlerError';
import HandlerSuccess from 'handler/HandlerSuccess';
import { Character } from '@prisma/client';
import { CharacterRepository } from 'repository/CharacterRepository';
import { ICreateCharacter, IGetCharacter, IUpdateCharacter } from 'interface/ICharacter';

export class CharacterService {
  private repository = new CharacterRepository();

  public async create(dto: ICreateCharacter): Promise<HandlerSuccess> {
    await this.checkIfNameExists(dto.name);
    await this.repository.save({
      name: dto.name,
      description: dto.description,
      characterClass: dto.characterClass,
    } as Character);
    return new HandlerSuccess('Cadastro de personagem efetuado com sucesso');
  }

  public async update(dto: IUpdateCharacter): Promise<HandlerSuccess> {
    await this.checkIfNameExists(dto.name, dto.id);
    await this.repository.update(dto.id, dto);
    return new HandlerSuccess('Atualização do personagem efetuado com sucesso');
  }

  public async getById(id: number): Promise<IGetCharacter> {
    const find = await this.repository.findById(id);
    if (!find) {
      throw new HandlerError('Personagem não encontrado');
    }
    const findMapped: IGetCharacter = {
      id: find.id,
      name: find.name,
      description: find.description,
      characterClass: find.characterClass,
    };
    return findMapped;
  }

  public async getAll(): Promise<IGetCharacter[]> {
    const findAll = await this.repository.findAll();
    const findAllMapped: IGetCharacter[] = findAll.map(find => ({
      id: find.id,
      name: find.name,
      description: find.description,
      characterClass: find.characterClass,
    }));
    return findAllMapped;
  }

  public async delete(id: number): Promise<HandlerSuccess> {
    await this.getById(id);
    await this.repository.delete(id);
    return new HandlerSuccess('Personagem excluído com sucesso');
  }

  private async checkIfNameExists(name: string, id?: number): Promise<void> {
    const exist = await this.repository.findByName(name);
    if (exist && (!id || exist.id !== id)) {
      throw new HandlerError('Nome já está cadastrado');
    }
  }
}
