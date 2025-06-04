import {Injectable} from '@nestjs/common';
import {PurchaseOrder} from '@prisma/client';
import {Decimal} from 'decimal.js';
import {PrismaService} from '../prisma.service';
import {PurchaseOrderSummaryDto} from './dto/purchase-order-summary.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PurchaseOrderSummaryDto[]> {
    const purchaseOrders = await this.prisma.purchaseOrder.findMany({
      include: {
        purchase_order_line_items: {
          select: {
            quantity: true,
            unit_cost: true,
          },
        },
      },
    });

    return purchaseOrders.map((purchaseOrder) => ({
      id: purchaseOrder.id,
      vendorName: purchaseOrder.vendor_name,
      orderDate: purchaseOrder.order_date,
      expectedDeliveryDate: purchaseOrder.expected_delivery_date,
      totalQuantity: purchaseOrder.purchase_order_line_items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      ),
      // we keep totalCost as a Decimal to avoid floating point errors
      totalCost: purchaseOrder.purchase_order_line_items.reduce(
        (acc, item) => acc.add(item.unit_cost.mul(item.quantity)),
        new Decimal(0),
      ),
    }));
  }

  findOne(id: number): Promise<PurchaseOrder | null> {
    return this.prisma.purchaseOrder.findUnique({where: {id: id}});
  }
}
