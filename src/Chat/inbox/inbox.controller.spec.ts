import { Test, TestingModule } from '@nestjs/testing';
import { InboxController } from './inbox.controller';

describe('InboxController', () => {
  let controller: InboxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InboxController],
    }).compile();

    controller = module.get<InboxController>(InboxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
