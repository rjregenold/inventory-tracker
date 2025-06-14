import {Module} from '@nestjs/common';
import {GracefulShutdownModule} from 'nestjs-graceful-shutdown';

import {AppService} from './app.service';

@Module({
  imports: [GracefulShutdownModule.forRoot()],
  providers: [AppService],
})
export class AppModule {}
