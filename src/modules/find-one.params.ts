import { IsInt, IsNumber, Max, Min } from 'class-validator';
import { maximumInt32 } from '@/utils/utils';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneParams {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(maximumInt32)
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;
}
