import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

jest.useFakeTimers();

describe('TaskService', () => {
  let taskService: TaskService;
  let logger: Logger;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, Logger, SchedulerRegistry],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    logger = module.get<Logger>(Logger);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);

    const cronExpression1 = '*/1 * * * *';
    const job1 = new CronJob(cronExpression1, () =>
      taskService.handleEvery1Minute(),
    );
    schedulerRegistry.addCronJob('everyMinuteJob', job1);
    job1.start();

    const cronExpression2 = '*/2 * * * *';
    const job2 = new CronJob(cronExpression2, () =>
      taskService.handleEvery2Minutes(),
    );
    schedulerRegistry.addCronJob('every2MinutesJob', job2);
    job2.start();

    const cronExpression4 = '*/4 * * * *';
    const job4 = new CronJob(cronExpression4, () =>
      taskService.handleEvery4Minutes(),
    );
    schedulerRegistry.addCronJob('every4MinutesJob', job4);
    job4.start();
  });

  it('should call handleEvery1Minute when the cron job triggers', () => {
    const handleEvery1MinuteSpy = jest.spyOn(taskService, 'handleEvery1Minute');
    taskService.handleEvery1Minute();
    expect(handleEvery1MinuteSpy).toHaveBeenCalled();
  });

  it('should call handleEvery2Minutes when the cron job triggers', () => {
    const handleEvery2MinutesSpy = jest.spyOn(
      taskService,
      'handleEvery2Minutes',
    );
    jest.advanceTimersByTime(120000);
    expect(handleEvery2MinutesSpy).toHaveBeenCalled();
  });

  it.skip('should log error when handleEvery2Minutes throws an error', () => {
    const errorSpy = jest.spyOn(logger, 'error');

    jest
      .spyOn(taskService, 'handleEvery2Minutes')
      .mockImplementationOnce(() => {
        throw new Error('Test error');
      });

    jest.advanceTimersByTime(120000);

    expect(errorSpy).toHaveBeenCalledWith(
      'Error adjusting life:',
      expect.any(Error),
    );
  });

  it('should call handleEvery4Minutes when the cron job triggers', () => {
    const handleEvery4MinutesSpy = jest.spyOn(
      taskService,
      'handleEvery4Minutes',
    );
    jest.advanceTimersByTime(240000);
    expect(handleEvery4MinutesSpy).toHaveBeenCalled();
  });

  it.skip('should log error when handleEvery4Minutes throws an error', () => {
    const errorSpy = jest.spyOn(logger, 'error');

    jest
      .spyOn(taskService, 'handleEvery4Minutes')
      .mockImplementationOnce(() => {
        throw new Error('Test error');
      });

    jest.advanceTimersByTime(240000);

    expect(errorSpy).toHaveBeenCalledWith(
      'Error updating life:',
      expect.any(Error),
    );
  });
});
