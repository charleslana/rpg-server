import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PageDto } from '@/dto/page.dto';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async save(params: { data: Prisma.UserCreateInput }) {
    const { data } = params;
    return this.prisma.user.create({
      data: {
        ...data,
        attribute: {
          create: {},
        },
        statistic: {
          create: {},
        },
        titles: {
          create: [
            {
              title: { connect: { id: 1 } },
              equipped: true,
            },
          ],
        },
        roles: {
          create: {},
        },
      },
    });
  }

  public findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email: {
          contains: email,
          mode: 'insensitive',
        },
      },
      include: {
        roles: true,
      },
    });
  }

  public findByNickname(nickname: string) {
    return this.prisma.user.findFirst({
      where: {
        nickname: {
          equals: nickname,
          mode: 'insensitive',
        },
      },
    });
  }

  public findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  public async find(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where,
      include: {
        attribute: true,
        statistic: true,
        titles: {
          where: { equipped: true },
          include: {
            title: true,
          },
        },
      },
    });
  }

  public async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({ skip, take, cursor, where, orderBy });
  }

  public update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.user.update({ where, data });
  }

  public delete(params: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.user.delete({ where });
  }

  public async findAllPaginatedAndFilter(params: {
    page: PageDto;
    nickname?: string;
  }) {
    const { page, nickname } = params;
    const { page: currentPage, pageSize } = page;
    const offset = (currentPage - 1) * pageSize;
    const take = pageSize;
    // const where: Prisma.UserWhereInput = {
    //   nickname: {
    //     not: null,
    //   },
    // };
    const where: Prisma.UserWhereInput = {};
    if (nickname) {
      where.nickname = {
        contains: nickname,
        mode: 'insensitive',
      };
    }
    const [totalCount, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        skip: offset,
        take,
        where,
        orderBy: [{ level: 'desc' }, { id: 'desc' }],
        include: {
          attribute: true,
          statistic: true,
        },
      }),
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = currentPage < totalPages;
    return {
      results: users,
      pagination: {
        totalCount,
        totalPages,
        currentPage,
        hasNextPage,
      },
    };
  }
}
