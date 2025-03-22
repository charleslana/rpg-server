import { Test, TestingModule } from '@nestjs/testing';
import { UserStatisticController } from './user-statistic.controller';

describe('UserStatisticController', () => {
  let controller: UserStatisticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStatisticController],
    }).compile();

    controller = module.get<UserStatisticController>(UserStatisticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
