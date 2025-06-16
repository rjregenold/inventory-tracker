import {Module} from '@nestjs/common';
import {EmailService} from '../email/email.service';
import {InventoryController} from './inventory.controller';

@Module({
  controllers: [InventoryController],
  providers: [EmailService],
})
export class InventoryModule {}
