import { Module } from '@nestjs/common';
import { UserTitleController } from './user-title.controller';
import { UserTitleService } from './user-title.service';

@Module({
  controllers: [UserTitleController],
  providers: [UserTitleService]
})
export class UserTitleModule {}
