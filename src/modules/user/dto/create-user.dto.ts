import {
  IsEmail,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsString,
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
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
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
  avatar: string;
}
