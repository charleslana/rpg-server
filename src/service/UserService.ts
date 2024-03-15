import DecodeType from 'types/DecodeType';
import HandlerError from 'handler/HandlerError';
import HandlerSuccess from 'handler/HandlerSuccess';
import jwt from 'jsonwebtoken';
import { decrypt, encrypt } from 'utils/crypt';
import { formatDate, generateRandomString } from 'utils/utils';
import { ICreateUser, IGetUser, IUser, UserMe } from 'interface/IUser';
import { MessageEnum } from 'enum/MessageEnum';
import { User } from '@prisma/client';
import { UserRepository } from 'repository/UserRepository';

export class UserService {
  private repository = new UserRepository();

  public async create(dto: ICreateUser): Promise<HandlerSuccess> {
    let exist = await this.repository.findByEmail(dto.email);
    if (exist) {
      throw new HandlerError('E-mail já está cadastrado', 400, MessageEnum.EmailAlreadyExists);
    }
    exist = await this.repository.findByName(dto.name);
    if (exist) {
      throw new HandlerError('Nome já está cadastrado', 400, MessageEnum.NameAlreadyExists);
    }
    await this.repository.save({
      email: dto.email,
      name: dto.name,
      password: encrypt(dto.password),
    } as User);
    return new HandlerSuccess('Cadastro de usuário efetuado com sucesso');
  }

  public async getMe(id: number): Promise<UserMe> {
    const find = await this.repository.findById(id);
    if (!find) {
      throw new HandlerError('Usuário não encontrado');
    }
    const findMapped: UserMe = {
      id: find.id,
      name: find.name,
      level: find.level,
      gold: find.gold,
      ruby: find.ruby,
      experience: find.experience,
      maxExperience: this.calculateMaxExperience(find.level),
    };
    return findMapped;
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

  public async delete(id: number): Promise<HandlerSuccess> {
    await this.getById(id);
    await this.repository.delete(id);
    return new HandlerSuccess('Usuário excluído com sucesso');
  }

  public async authenticate(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const find = await this.repository.findByEmail(email);
    if (!find) {
      throw new HandlerError('Usuário ou senha inválida', 403, MessageEnum.InvalidUserOrPassword);
    }
    this.validateUserLogin(find, password);
    const updated = await this.updateAuthToken(find);
    const accessToken = this.generateAccessToken(updated);
    const refreshToken = this.generateRefreshToken(updated);
    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET as string
      ) as DecodeType;
      const find = await this.repository.findById(decoded.user.id);
      if (!find) {
        throw new HandlerError('Acesso não encontrado', 403);
      }
      const updated = await this.updateAuthToken(find);
      return this.generateAccessToken(updated);
    } catch (error) {
      throw new HandlerError('Erro ao renovar token de acesso', 403);
    }
  }

  public async getUserByIdAndAuthToken(id: number, authToken: string | null): Promise<User | null> {
    const find = await this.repository.findByAuthToken(id, authToken);
    return find;
  }

  private validateUserLogin(dto: User, password: string): void {
    const isPasswordValid = decrypt(password, dto.password);
    if (!isPasswordValid) {
      throw new HandlerError('Usuário ou senha inválida', 403, MessageEnum.InvalidUserOrPassword);
    }
    const isUserBanned = dto.bannedTime != null && dto.bannedTime > new Date();
    if (isUserBanned) {
      throw new HandlerError(
        `O usuário está banido até ${formatDate(dto.bannedTime as Date)}`,
        403,
        MessageEnum.UserBanned,
        dto.bannedTime
      );
    }
  }

  private async updateAuthToken(user: User): Promise<IUser | null> {
    const updated = await this.repository.update(user.id, {
      authToken: generateRandomString(100),
    });
    return updated;
  }

  private generateAccessToken(user: IUser | null): string {
    return jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
      expiresIn: '1d',
    });
  }

  private generateRefreshToken(user: IUser | null): string {
    return jwt.sign({ user }, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
      expiresIn: '7d',
    });
  }

  private calculateMaxExperience(level: number): number {
    return 50 * level;
  }
}
