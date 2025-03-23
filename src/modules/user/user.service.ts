import { BusinessRuleException } from '@/helpers/error/business-rule-exception';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { formatDate } from '@/utils/utils';
import { Injectable } from '@nestjs/common';
import { PageDto } from '@/dto/page.dto';
import { ResponseMessage } from '@/helpers/response-message';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  public async create(dto: CreateUserDto) {
    const exists = await this.repository.findByEmail(dto.email);
    if (exists) {
      throw new BusinessRuleException('O e-mail do usuário já existe');
    }
    const nicknameExists = await this.repository.findByNickname(dto.nickname);
    if (nicknameExists) {
      throw new BusinessRuleException('O nickname do usuário já existe');
    }
    dto.password = await dto.hashPassword(dto.password);
    if (dto.gender === 'male') {
      dto.avatar = 'default';
    } else {
      dto.avatar = 'default2';
    }
    return this.repository.save({
      data: dto,
    });
  }

  public async get(id: number) {
    const find = await this.repository.find({ id });
    if (!find) {
      throw new BusinessRuleException('Usuário não encontrado');
    }
    return {
      ...find,
    };
  }

  public async getAll() {
    return this.repository.findAll({});
  }

  public async filterUsersPaginated(page: PageDto, dto?: FilterUserDto) {
    const findAllPaginated = await this.repository.findAllPaginatedAndFilter({
      page,
      nickname: dto?.nickname,
    });
    const filteredResults = findAllPaginated.results.map((user) => {
      return {
        ...user,
      };
    });
    return {
      ...findAllPaginated,
      results: filteredResults,
    };
  }

  public async exclude(id: number) {
    await this.get(id);
    await this.repository.delete({ where: { id } });
    return new ResponseMessage('Usuário deletado com sucesso');
  }

  public async updateUserPassword(dto: UpdateUserPasswordDto) {
    const existingUser = await this.get(dto.id);
    const isPasswordValid = await dto.decryptPassword(
      dto.currentPassword,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new BusinessRuleException('Senha do usuário atual inválida');
    }
    const password = await dto.hashPassword(dto.newPassword);
    return this.repository.update({
      data: {
        password,
      },
      where: {
        id: dto.id,
      },
    });
  }

  public async getUserByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  public async updateUserNickname(dto: UpdateUserDto) {
    const existingUser = await this.get(dto.userId);
    const existingUserWithName = await this.repository.findByNickname(
      dto.nickname,
    );
    if (existingUserWithName && existingUserWithName.id !== existingUser.id) {
      throw new BusinessRuleException(
        'Nome de personagem do usuário já existe',
      );
    }
    return this.repository.update({
      data: {
        nickname: dto.nickname,
      },
      where: {
        id: dto.userId,
      },
    });
  }

  public validateUserBanned(bannedTime: Date | null): void {
    const isUserBanned = bannedTime != null && bannedTime > new Date();
    if (isUserBanned) {
      throw new BusinessRuleException(
        `O usuário está banido até ${formatDate(bannedTime)}`,
        403,
      );
    }
  }

  public async getUserByName(name: string) {
    const find = await this.repository.findByNickname(name);
    if (!find) {
      throw new BusinessRuleException('Usuário não encontrado pelo nome');
    }
    return find;
  }
}
