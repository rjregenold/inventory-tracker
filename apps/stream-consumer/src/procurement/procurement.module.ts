import {Module} from '@nestjs/common';
import {EmailService} from '../email/email.service';
import {ProcurementController} from './procurement.controller';

@Module({
  controllers: [ProcurementController],
  providers: [EmailService],
})
export class ProcurementModule {}
