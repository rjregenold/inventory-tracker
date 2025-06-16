import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import {EmailService} from '../email/email.service';
import {
  ProcurementEvent,
  PurchaseOrderCreatedEvent,
} from '@gddy-coding-exercise/shared-events';
import {Controller, Logger} from '@nestjs/common';

@Controller()
export class ProcurementController {
  private readonly logger = new Logger(ProcurementController.name);

  constructor(private emailService: EmailService) {}

  @MessagePattern('procurement')
  async handleEvent(
    @Payload() event: ProcurementEvent,
    @Ctx() context: KafkaContext,
  ) {
    const partition = context.getPartition();
    const msg = context.getMessage();
    this.logger.log(
      `Processing ${event.eventType} | Parititon: ${partition} | Offset: ${msg.offset}`,
    );

    try {
      switch (event.eventType) {
        case 'procurement.purchase-order-created':
          await this.handlePurchaseOrderCreated(event);
          break;
        default:
          this.logger.warn(`unknown event type ${(event as any).eventType}`);
          break;
      }
    } catch (err) {
      this.logger.error(`failed to process ${event.eventType}: ${err}`);
      // in a real application, we would retry or dead-letter the event
    }
  }

  private async handlePurchaseOrderCreated(event: PurchaseOrderCreatedEvent) {
    await this.emailService.sendOrderApprovalNeeded(event);
  }
}
