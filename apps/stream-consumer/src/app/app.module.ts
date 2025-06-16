import {Module} from '@nestjs/common';
import {GracefulShutdownModule} from 'nestjs-graceful-shutdown';

import {AppService} from './app.service';
import {EmailModule} from '../email/email.module';
import {AuthModule} from '../auth/auth.module';
import {InventoryModule} from '../inventory/inventory.module';
import {ProcurementModule} from '../procurement/procurement.module';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    EmailModule,
    AuthModule,
    InventoryModule,
    ProcurementModule,
  ],
  providers: [AppService],
})
export class AppModule {}
