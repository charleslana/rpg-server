import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: 'America/Sao_Paulo' })
  public handleEvery1Minute() {
    this.logger.log('Task executed every 1 minute');
  }

  @Cron('*/2 * * * *', { timeZone: 'America/Sao_Paulo' })
  public handleEvery2Minutes() {
    this.logger.log('Adjust life if exceeds max every 2 minutes');
    try {
      this.logger.log('Life adjusted successfully for all users');
    } catch (error) {
      this.logger.error('Error adjusting life:', error);
    }
  }

  @Cron('*/4 * * * *', { timeZone: 'America/Sao_Paulo' })
  public handleEvery4Minutes() {
    this.logger.log('Increase life every 4 minutes');
    try {
      this.logger.log('Life updated successfully for all users');
    } catch (error) {
      this.logger.error('Error updating life:', error);
    }
  }
}
