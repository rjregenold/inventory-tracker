import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {VendorDto} from './dto/vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  findByName(name: string): Promise<VendorDto | null> {
    // in a real application, we'd lookup the vendor
    return Promise.resolve({name});
  }
}
