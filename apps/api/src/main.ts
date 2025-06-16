import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {setupGracefulShutdown} from 'nestjs-graceful-shutdown';

import {AppModule} from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.enableShutdownHooks();
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();

  // handles signals (SIGINT, SIGTERM) and gives the
  // app an opportunity to shutdown cleanly
  setupGracefulShutdown({app});

  const port = process.env.PORT || 3100;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
