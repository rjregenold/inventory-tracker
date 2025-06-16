import {Module} from '@nestjs/common';
import {EmailService} from '../email/email.service';
import {AuthController} from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [EmailService],
})
export class AuthModule {}
