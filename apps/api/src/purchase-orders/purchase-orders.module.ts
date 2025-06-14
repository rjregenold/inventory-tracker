import {Module} from '@nestjs/common';
import {PurchaseOrdersService} from './purchase-orders.service';
import {PurchaseOrdersController} from './purchase-orders.controller';
import {PrismaService} from '../prisma.service';
import {VendorsService} from '../vendors/vendors.service';

@Module({
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService, VendorsService, PrismaService],
})
export class PurchaseOrdersModule {}
