import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageDto {
  @ApiProperty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page: number;

  @ApiProperty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(20)
  pageSize: number;
}
