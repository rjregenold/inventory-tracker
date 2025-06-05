import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {PurchaseOrderSummaryDto} from './dto/purchase-order-summary.dto';
import {PurchaseOrderFullDto} from './dto/purchase-order-full.dto';
import {PurchaseOrderMapper} from './mappers/purchase-order.mapper';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PurchaseOrderSummaryDto[]> {
    const purchaseOrders = await this.prisma.purchaseOrder.findMany({
      orderBy: {expectedDeliveryDate: 'asc'},
      include: {
        lineItems: {
          select: {
            quantity: true,
            unitCost: true,
          },
        },
      },
    });

    return purchaseOrders.map(PurchaseOrderMapper.toSummaryDto);
  }

  async findOne(id: number): Promise<PurchaseOrderFullDto | null> {
    const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
      where: {id},
      include: {lineItems: true},
    });

    if (!purchaseOrder) {
      return null;
    }

    return PurchaseOrderMapper.toFullDto(purchaseOrder);
  }
}
