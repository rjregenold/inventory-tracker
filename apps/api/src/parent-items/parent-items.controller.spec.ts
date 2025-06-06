import {ParentItemsController} from './parent-items.controller';
import {ParentItemsService} from './parent-items.service';
import {PrismaService} from '../prisma.service';
import {createTestModuleBuilder} from 'apps/api/test/helpers/create-test-module';

describe('ParentItemsController', () => {
  let controller: ParentItemsController;

  beforeEach(async () => {
    const module = await createTestModuleBuilder({
      controllers: [ParentItemsController],
      providers: [ParentItemsService, PrismaService],
    }).compile();

    controller = module.get<ParentItemsController>(ParentItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
