import {Module} from '@nestjs/common';
import {GracefulShutdownModule} from 'nestjs-graceful-shutdown';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ParentItemsModule} from '../parent-items/parent-items.module';
import {PurchaseOrdersModule} from '../purchase-orders/purchase-orders.module';
import {VendorsModule} from '../vendors/vendors.module';
import {EventsModule} from '../events/events.module';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    ParentItemsModule,
    PurchaseOrdersModule,
    VendorsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
