import { Test, TestingModule } from '@nestjs/testing';
import { MetaUserController } from './meta-user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: MetaUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaUserController],
      providers: [UserService],
    }).compile();

    controller = module.get<MetaUserController>(MetaUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
