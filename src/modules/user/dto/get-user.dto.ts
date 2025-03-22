import { Expose, Type } from 'class-transformer';
import { GetUserAttributeDto } from '@/modules/user-attribute/dto/get-user-attribute.dto';
import {
  CharacterClassEnum,
  GenderEnum,
  UserAttribute,
  UserStatistic,
  UserTitle,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserStatisticDto } from '@/modules/user-statistic/dto/get-user-statistic.dto';
import { GetUserTitleDto } from '@/modules/user-title/dto/get-user-title.dto';
import { calculateMaxLife } from '@/utils/utils';

export class GetUserDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty({ nullable: true })
  @Expose()
  bannedTime: Date | null;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  nickname: string;

  @ApiProperty()
  @Expose()
  gender: GenderEnum;

  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty({ enum: CharacterClassEnum })
  @Expose()
  characterClass: CharacterClassEnum;

  @ApiProperty()
  @Expose()
  level: number;

  @ApiProperty()
  @Expose()
  gold: number;

  @ApiProperty()
  @Expose()
  credit: number;

  @ApiProperty()
  @Expose()
  emerald: number;

  @ApiProperty()
  @Expose()
  sapphire: number;

  @ApiProperty()
  @Expose()
  crystal: number;

  @ApiProperty()
  @Expose()
  diamond: number;

  @ApiProperty()
  @Expose()
  exp: number;

  @ApiProperty()
  @Expose()
  life: number;
  @ApiProperty({ nullable: true })
  @Expose()
  description: string | null;
  @ApiProperty()
  @Expose()
  createdAt: Date;
  @ApiProperty()
  @Expose()
  updatedAt: Date;
  @ApiProperty({ type: GetUserAttributeDto })
  @Expose()
  @Type(() => GetUserAttributeDto)
  attribute: UserAttribute;
  @ApiProperty({ type: GetUserStatisticDto })
  @Expose()
  @Type(() => GetUserStatisticDto)
  statistic: UserStatistic;
  @ApiProperty({ type: GetUserTitleDto })
  @Expose()
  @Type(() => GetUserTitleDto)
  titles: UserTitle[];

  @ApiProperty()
  @Expose()
  get maxLife(): number {
    return calculateMaxLife(this.level);
  }

  @ApiProperty()
  @Expose()
  get equippedTitle() {
    if (Array.isArray(this.titles) && this.titles.length > 0) {
      return this.titles.find((title) => title.equipped === true) || null;
    }
    return null;
  }
}

export class GetUserExposeDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  nickname: string;

  @ApiProperty({ enum: GenderEnum })
  @Expose()
  gender: GenderEnum;

  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty({ enum: CharacterClassEnum })
  @Expose()
  characterClass: CharacterClassEnum;

  @ApiProperty()
  @Expose()
  level: number;

  @ApiProperty()
  @Expose()
  gold: number;

  @ApiProperty()
  @Expose()
  exp: number;

  @ApiProperty()
  @Expose()
  life: number;

  @ApiProperty({ nullable: true })
  @Expose()
  description: string | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
