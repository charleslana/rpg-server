import {
  IsEmail, IsEmpty,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserDto } from './user.dto';
import { CharacterClassEnum, GenderEnum } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends UserDto {
  @ApiProperty()
  @IsEmail()
  @IsLowercase()
  @MaxLength(50)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
    message: 'O nome deve conter apenas letras e espaços',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9_]+$/, {
    message:
      'O nome do personagem só pode conter letras, números e underscore (_).',
  })
  nickname: string;

  @ApiProperty({ enum: GenderEnum })
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ enum: CharacterClassEnum })
  @IsNotEmpty()
  @IsEnum(CharacterClassEnum)
  characterClass: CharacterClassEnum;

  @ApiHideProperty()
  @IsEmpty()
  avatar: string;
}
