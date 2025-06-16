import {Module} from '@nestjs/common';
import {PurchaseOrdersService} from './purchase-orders.service';
import {PurchaseOrdersController} from './purchase-orders.controller';
import {PrismaService} from '../prisma.service';
import {VendorsService} from '../vendors/vendors.service';
import {EventsModule} from '../events/events.module';
import {UsersService} from '../users/users.service';

@Module({
  imports: [EventsModule],
  controllers: [PurchaseOrdersController],
  providers: [
    PurchaseOrdersService,
    VendorsService,
    UsersService,
    PrismaService,
  ],
})
export class PurchaseOrdersModule {}
