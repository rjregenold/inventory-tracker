import {Injectable} from '@nestjs/common';
import {PurchaseOrder} from '@prisma/client';
import {PrismaService} from '../prisma.service';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PurchaseOrder[]> {
    return this.prisma.purchaseOrder.findMany();
  }

  findOne(id: number): Promise<PurchaseOrder | null> {
    return this.prisma.purchaseOrder.findUnique({where: {id: id}});
  }
}
