import {Module, OnModuleInit, OnModuleDestroy} from '@nestjs/common';
import {Kafka} from 'kafkajs';
import {EventPublisher} from '@gddy-coding-exercise/shared-events';

@Module({
  providers: [
    {
      provide: 'KAFKA_CLIENT',
      useFactory: () => {
        return new Kafka({
          clientId: process.env.KAFKA_CLIENT_ID || 'inventory-api',
          brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
          retry: {
            initialRetryTime: 100,
            retries: 8,
          },
        });
      },
    },
    {
      provide: EventPublisher,
      useFactory: (kafka: Kafka) => {
        const serviceName = process.env.SERVICE_NAME || 'inventory-api';
        return new EventPublisher(kafka, serviceName);
      },
      inject: ['KAFKA_CLIENT'],
    },
  ],
  exports: [EventPublisher],
})
export class EventsModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async onModuleInit() {
    await this.eventPublisher.connect();
  }

  async onModuleDestroy() {
    await this.eventPublisher.disconnect();
  }
}
