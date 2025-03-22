import { CharacterClassEnum, GenderEnum } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserDto } from './user.dto';
import {
  IsEnum,
  IsNotEmpty, IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  newPassword: string;

  @Exclude()
  id: number;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, { message: 'O nickname deve ter pelo menos 3 caracteres' })
  @MaxLength(20, { message: 'O nickname não pode ter mais de 20 caracteres' })
  @Matches(/^[A-Za-z0-9_]+$/, {
    message: 'O nickname só pode conter letras, números e underscore (_).',
  })
  nickname: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(CharacterClassEnum)
  characterClass: CharacterClassEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar: string;

  @Exclude()
  userId: number;
}
