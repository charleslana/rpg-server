import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetTitleDto {
  @ApiProperty()
  @Expose()
  name: number;
}

export class GetTitleExposeDto {
  @ApiProperty()
  @Expose()
  name: number;
}
