import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {PrismaService} from '../prisma.service';
import {EventsModule} from '../events/events.module';
import {PassportModule} from '@nestjs/passport';
import {JwtStrategy} from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1d'},
    }),
    EventsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
})
export class AuthModule {}
