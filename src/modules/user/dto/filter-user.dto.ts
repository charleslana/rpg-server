import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterUserDto {
  @ApiProperty({
    description: 'Nickname of the user to filter by',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  nickname?: string;
}
