import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetTitleDto {
  @ApiProperty()
  @Expose()
  name: string;
}

export class GetTitleExposeDto {
  @ApiProperty()
  @Expose()
  name: string;
}
