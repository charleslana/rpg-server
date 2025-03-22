import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserTitle } from '@prisma/client';
import { GetTitleDto } from '@/modules/title/dto/get-title.dto';

export class GetUserTitleDto {
  @ApiProperty()
  @Expose()
  equipped: boolean;

  @ApiProperty({ type: GetTitleDto })
  @Expose()
  @Type(() => GetTitleDto)
  title: UserTitle;
}

export class GetUserTitleExposeDto {
  @ApiProperty()
  @Expose()
  equipped: boolean;

  @ApiProperty({ type: GetTitleDto })
  @Expose()
  @Type(() => GetTitleDto)
  title: UserTitle;
}
