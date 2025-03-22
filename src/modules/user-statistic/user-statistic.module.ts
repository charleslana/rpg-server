import { Module } from '@nestjs/common';
import { UserStatisticController } from './user-statistic.controller';
import { UserStatisticService } from './user-statistic.service';

@Module({
  controllers: [UserStatisticController],
  providers: [UserStatisticService],
})
export class UserStatisticModule {}
