import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindNicknameParams {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'O nickname deve ter pelo menos 3 caracteres' })
  @MaxLength(20, { message: 'O nickname não pode ter mais de 20 caracteres' })
  @Matches(/^[A-Za-z0-9_]+$/, {
    message: 'O nickname só pode conter letras, números e underscore (_).',
  })
  nickname: string;
}
