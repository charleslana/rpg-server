import HandlerError from 'handler/HandlerError';
import HandlerSuccess from 'handler/HandlerSuccess';
import jwt from 'jsonwebtoken';
import { decrypt, encrypt } from 'utils/crypt';
import { formatDate, generateRandomString } from 'utils/utils';
import { ICreateUser, IGetUser, IUserRole } from 'interface/IUser';
import { User } from '@prisma/client';
import { UserRepository } from 'repository/UserRepository';

export class UserService {
  private repository = new UserRepository();

  public async create(dto: ICreateUser): Promise<HandlerSuccess> {
    let exist = await this.repository.findByEmail(dto.email);
    if (exist) {
      throw new HandlerError('E-mail já está cadastrado');
    }
    exist = await this.repository.findByName(dto.name);
    if (exist) {
      throw new HandlerError('Nome já está cadastrado');
    }
    await this.repository.save({
      email: dto.email,
      name: dto.name,
      password: encrypt(dto.password),
    } as User);
    return new HandlerSuccess('Cadastro de usuário efetuado com sucesso');
  }

  public async getById(id: number): Promise<IGetUser> {
    const find = await this.repository.findById(id);
    if (!find) {
      throw new HandlerError('Usuário não encontrado');
    }
    const findMapped: IGetUser = {
      id: find.id,
      name: find.name,
      updatedAt: find.updatedAt,
    };
    return findMapped;
  }

  public async getAll(): Promise<IGetUser[]> {
    const findAll = await this.repository.findAll();
    const findAllMapped: IGetUser[] = findAll.map(find => ({
      id: find.id,
      name: find.name,
      updatedAt: find.updatedAt,
    }));
    return findAllMapped;
  }

  async delete(id: number): Promise<HandlerSuccess> {
    await this.getById(id);
    await this.repository.delete(id);
    return new HandlerSuccess('Usuário excluído com sucesso');
  }

  public async authenticate(email: string, password: string): Promise<{ token: string }> {
    const find = await this.repository.findByEmail(email);
    if (!find) {
      throw new HandlerError('Usuário ou senha inválida', 403);
    }
    this.validateUserLogin(find, password);
    const updated = await this.updateAuthToken(find);
    const token = this.generateToken(updated);
    return {
      token: token,
    };
  }

  public async getUserByIdAndAuthToken(id: number, authToken: string | null): Promise<User | null> {
    const find = await this.repository.findByAuthToken(id, authToken);
    return find;
  }

  private validateUserLogin(dto: User, password: string): void {
    const isPasswordValid = decrypt(password, dto.password);
    const isUserBanned = dto.bannedTime != null && dto.bannedTime > new Date();
    if (!isPasswordValid || isUserBanned) {
      let errorMessage = 'Usuário ou senha inválida';
      if (isUserBanned) {
        errorMessage = `O usuário está banido até ${formatDate(dto.bannedTime as Date)})`;
      }
      throw new HandlerError(errorMessage, 403);
    }
  }

  private async updateAuthToken(user: User): Promise<IUserRole | null> {
    const updated = await this.repository.update(user.id, {
      authToken: generateRandomString(100),
    });
    return updated;
  }

  private generateToken(user: IUserRole | null): string {
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
    return token;
  }
}
