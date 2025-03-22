import { Test, TestingModule } from '@nestjs/testing';
import { UserTitleService } from './user-title.service';

describe('UserTitleService', () => {
  let service: UserTitleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTitleService],
    }).compile();

    service = module.get<UserTitleService>(UserTitleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
