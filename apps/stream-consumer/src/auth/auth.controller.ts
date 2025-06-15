import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import {formatDistance} from 'date-fns';
import {EmailService} from '../email/email.service';
import {
  AuthEvent,
  AuthOtpCreatedEvent,
} from '@gddy-coding-exercise/shared-events';
import {Controller, Logger} from '@nestjs/common';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private emailService: EmailService) {}

  @MessagePattern('auth')
  async handleAuthEvent(
    @Payload() event: AuthEvent,
    @Ctx() context: KafkaContext,
  ) {
    const partition = context.getPartition();
    const msg = context.getMessage();
    this.logger.log(
      `Processing ${event.eventType} | Parititon: ${partition} | Offset: ${msg.offset}`,
    );

    try {
      switch (event.eventType) {
        case 'auth.otp-created':
          await this.handleOtpCreated(event);
          break;
        case 'auth.sign-in':
          // TODO: could send welcome email on new sign up
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

  private async handleOtpCreated(event: AuthOtpCreatedEvent) {
    const {email, code, expires, createdAt} = event.data;

    await this.emailService.sendOtp(
      email,
      code,
      formatDistance(expires, createdAt),
    );
  }
}
