import { Test, TestingModule } from '@nestjs/testing';
import { UserStatisticService } from './user-statistic.service';

describe('UserStatisticService', () => {
  let service: UserStatisticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStatisticService],
    }).compile();

    service = module.get<UserStatisticService>(UserStatisticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
