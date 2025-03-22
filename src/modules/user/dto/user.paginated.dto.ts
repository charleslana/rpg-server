import { Expose, Type } from 'class-transformer';
import { GetUserExposeDto } from './get-user.dto';
import { PaginatedDto } from '@/dto/paginated.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserPaginatedDto<T> {
  @ApiProperty({ type: [GetUserExposeDto] })
  @Expose()
  @Type(() => GetUserExposeDto)
  results: T;

  @ApiProperty({ type: PaginatedDto })
  @Expose()
  @Type(() => PaginatedDto)
  pagination: PaginatedDto;
}
