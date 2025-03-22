import { Test, TestingModule } from '@nestjs/testing';
import { UserTitleController } from './user-title.controller';

describe('UserTitleController', () => {
  let controller: UserTitleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTitleController],
    }).compile();

    controller = module.get<UserTitleController>(UserTitleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
