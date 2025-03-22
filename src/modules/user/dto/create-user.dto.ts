import {
  IsEmail,
  IsEmpty,
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
  @MaxLength(50)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(50, { message: 'O nome não pode ter mais de 50 caracteres' })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
    message: 'O nome deve conter apenas letras e espaços',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'O nickname deve ter pelo menos 3 caracteres' })
  @MaxLength(20, { message: 'O nickname não pode ter mais de 20 caracteres' })
  @Matches(/^[A-Za-z0-9_]+$/, {
    message: 'O nickname só pode conter letras, números e underscore (_).',
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
