import {Module} from '@nestjs/common';
import {GracefulShutdownModule} from 'nestjs-graceful-shutdown';

import {AppService} from './app.service';
import {EmailModule} from '../email/email.module';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports: [GracefulShutdownModule.forRoot(), EmailModule, AuthModule],
  providers: [AppService],
})
export class AppModule {}
