import {ParentItemsService} from './parent-items.service';
import {PrismaService} from '../prisma.service';
import {createTestModuleBuilder} from '../../test/helpers/create-test-module';

describe('ParentItemsService', () => {
  let service: ParentItemsService;

  beforeEach(async () => {
    const module = await createTestModuleBuilder({
      providers: [ParentItemsService, PrismaService],
    }).compile();

    service = module.get<ParentItemsService>(ParentItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
