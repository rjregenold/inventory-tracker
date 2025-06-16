import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import {EmailService} from '../email/email.service';
import {
  InventoryEvent,
  InventoryExpectedEvent,
} from '@gddy-coding-exercise/shared-events';
import {Controller, Logger} from '@nestjs/common';

@Controller()
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(private emailService: EmailService) {}

  @MessagePattern('inventory')
  async handleEvent(
    @Payload() event: InventoryEvent,
    @Ctx() context: KafkaContext,
  ) {
    const partition = context.getPartition();
    const msg = context.getMessage();
    this.logger.log(
      `Processing ${event.eventType} | Parititon: ${partition} | Offset: ${msg.offset}`,
    );

    try {
      switch (event.eventType) {
        case 'inventory.expected':
          await this.handleInventoryExpected(event);
          break;
        case 'inventory.received':
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

  private async handleInventoryExpected(event: InventoryExpectedEvent) {}
}
