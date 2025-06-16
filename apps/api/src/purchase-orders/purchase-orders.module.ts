import {Module} from '@nestjs/common';
import {PurchaseOrdersService} from './purchase-orders.service';
import {PurchaseOrdersController} from './purchase-orders.controller';
import {PrismaService} from '../prisma.service';
import {VendorsService} from '../vendors/vendors.service';
import {EventsModule} from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService, VendorsService, PrismaService],
})
export class PurchaseOrdersModule {}
