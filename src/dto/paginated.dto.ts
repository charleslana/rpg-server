import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto {
  @ApiProperty()
  @Expose()
  totalCount: number;

  @ApiProperty()
  @Expose()
  totalPages: number;

  @ApiProperty()
  @Expose()
  currentPage: number;

  @ApiProperty()
  @Expose()
  hasNextPage: boolean;
}
