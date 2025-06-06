import {PurchaseOrdersController} from './purchase-orders.controller';
import {PurchaseOrdersService} from './purchase-orders.service';
import {PrismaService} from '../prisma.service';
import {createTestModuleBuilder} from 'apps/api/test/helpers/create-test-module';

describe('PurchaseOrdersController', () => {
  let controller: PurchaseOrdersController;

  beforeEach(async () => {
    const module = await createTestModuleBuilder({
      controllers: [PurchaseOrdersController],
      providers: [PurchaseOrdersService, PrismaService],
    }).compile();

    controller = module.get<PurchaseOrdersController>(PurchaseOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
