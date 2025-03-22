import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserStatisticDto {
  @ApiProperty()
  @Expose()
  honorVictories: number;

  @ApiProperty()
  @Expose()
  totalBattles: number;

  @ApiProperty()
  @Expose()
  battlesWon: number;

  @ApiProperty()
  @Expose()
  battlesLost: number;

  @ApiProperty()
  @Expose()
  battlesDraw: number;

  @ApiProperty()
  @Expose()
  damageDone: number;

  @ApiProperty()
  @Expose()
  damageSuffered: number;

  @ApiProperty()
  @Expose()
  goldWon: number;

  @ApiProperty()
  @Expose()
  goldLost: number;

  @ApiProperty()
  @Expose()
  arenaPoints: number;
}

export class GetUserStatisticExposeDto {
  @ApiProperty()
  @Expose()
  honorVictories: number;

  @ApiProperty()
  @Expose()
  totalBattles: number;

  @ApiProperty()
  @Expose()
  battlesWon: number;

  @ApiProperty()
  @Expose()
  battlesLost: number;

  @ApiProperty()
  @Expose()
  battlesDraw: number;

  @ApiProperty()
  @Expose()
  damageDone: number;

  @ApiProperty()
  @Expose()
  damageSuffered: number;

  @ApiProperty()
  @Expose()
  goldWon: number;

  @ApiProperty()
  @Expose()
  goldLost: number;

  @ApiProperty()
  @Expose()
  arenaPoints: number;
}
