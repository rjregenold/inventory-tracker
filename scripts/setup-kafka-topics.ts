import {Kafka} from 'kafkajs';
import {ensureTopicsExist} from '../libs/shared-events/src/kafka/topics';

async function setupTopics() {
  const kafka = new Kafka({
    brokers: process.env.KAFKA_BROKERS?.split('.') || ['localhost:9092'],
  });

  await ensureTopicsExist(kafka);
}

setupTopics();
