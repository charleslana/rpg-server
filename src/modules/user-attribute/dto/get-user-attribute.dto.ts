import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserAttributeDto {
  @ApiProperty()
  @Expose()
  strength: number;

  @ApiProperty()
  @Expose()
  defense: number;

  @ApiProperty()
  @Expose()
  agility: number;

  @ApiProperty()
  @Expose()
  intelligence: number;

  @ApiProperty()
  @Expose()
  endurance: number;

  @ApiProperty()
  @Expose()
  spendPoint: number;
}

export class GetUserAttributeExposeDto {
  @ApiProperty()
  @Expose()
  strength: number;

  @ApiProperty()
  @Expose()
  defense: number;

  @ApiProperty()
  @Expose()
  agility: number;

  @ApiProperty()
  @Expose()
  intelligence: number;

  @ApiProperty()
  @Expose()
  endurance: number;
}
