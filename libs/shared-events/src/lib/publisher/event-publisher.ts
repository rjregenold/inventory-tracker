import {Kafka, Producer} from 'kafkajs';
import {randomUUID} from 'crypto';
import {BaseEvent} from '../events';

export class EventPublisher {
  private producer: Producer;
  private serviceName: string;

  constructor(kafka: Kafka, serviceName: string) {
    this.producer = kafka.producer();
    this.serviceName = serviceName;
  }

  connect(): Promise<void> {
    return this.producer.connect();
  }

  disconnect(): Promise<void> {
    return this.producer.disconnect();
  }

  async publish<T extends BaseEvent>(
    event: Omit<T, 'eventId' | 'timestamp' | 'source' | 'version'>,
  ): Promise<void> {
    const enriched: T = {
      ...event,
      eventId: randomUUID(),
      timestamp: new Date().toISOString(),
      source: this.serviceName,
      version: '1.0',
    } as T;

    const topic = this.getTopicFromEventType(event.eventType);

    await this.producer.send({
      topic,
      messages: [
        {
          key: this.getPartitionKey(enriched),
          value: JSON.stringify(enriched),
          headers: {
            'event-type': event.eventType,
            source: this.serviceName,
          },
        },
      ],
    });
  }

  private getTopicFromEventType(eventType: string): string {
    const [topic] = eventType.split('.');
    return topic;
  }

  private getPartitionKey(event: BaseEvent): string {
    if (
      'data' in event &&
      typeof event.data === 'object' &&
      event.data !== null
    ) {
      const data = event.data as any;
      if (data.productId) return data.productId;
      if (data.purchaseOrderId) return data.purchaseOrderId;
    }
    return event.eventId;
  }
}
