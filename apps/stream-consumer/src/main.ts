import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {setupGracefulShutdown} from 'nestjs-graceful-shutdown';
import {AppModule} from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'stream-consumer-group',
        allowAutoTopicCreation: false,
      },
    },
  });

  setupGracefulShutdown({app});

  await app.startAllMicroservices();
}

bootstrap();
