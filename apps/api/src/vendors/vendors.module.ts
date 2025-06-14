import {Module} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {VendorsService} from './vendors.service';

@Module({
  providers: [VendorsService, PrismaService],
})
export class VendorsModule {}
