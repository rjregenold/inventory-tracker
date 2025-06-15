import {Module} from '@nestjs/common';
import {GracefulShutdownModule} from 'nestjs-graceful-shutdown';

import {AppService} from './app.service';
import {EmailModule} from '../email/email.module';

@Module({
  imports: [GracefulShutdownModule.forRoot(), EmailModule],
  providers: [AppService],
})
export class AppModule {}
