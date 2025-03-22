import { CharacterClassEnum, GenderEnum } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserDto } from './user.dto';
import {
  IsEnum,
  IsNotEmpty,
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
  @MaxLength(30)
  newPassword: string;

  @Exclude()
  id: number;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, { message: 'O nickname deve ter pelo menos 3 caracteres' })
  @MaxLength(20, { message: 'O nickname não pode ter mais de 20 caracteres' })
  @Matches(/^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/, {
    message:
      'O nickname deve conter apenas letras, números e espaço, não pode começar ou terminar com espaço',
  })
  nickname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CharacterClassEnum)
  characterClass: CharacterClassEnum;

  @ApiProperty()
  @IsString()
  avatar: string;

  @Exclude()
  userId: number;
}
