import {PurchaseOrdersService} from './purchase-orders.service';
import {PrismaService} from '../prisma.service';
import {createTestModuleBuilder} from 'apps/api/test/helpers/create-test-module';

describe('PurchaseOrdersService', () => {
  let service: PurchaseOrdersService;

  beforeEach(async () => {
    const module = await createTestModuleBuilder({
      providers: [PurchaseOrdersService, PrismaService],
    }).compile();

    service = module.get<PurchaseOrdersService>(PurchaseOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
