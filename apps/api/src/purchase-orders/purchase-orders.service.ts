import {BadRequestException, Injectable} from '@nestjs/common';
import {addDays} from 'date-fns';
import {PrismaService} from '../prisma.service';
import {PurchaseOrderSummaryDto} from './dto/purchase-order-summary.dto';
import {PurchaseOrderFullDto} from './dto/purchase-order-full.dto';
import {PurchaseOrderMapper} from './mappers/purchase-order.mapper';
import {CreatePurchaseOrderDto} from './create-purchase-order-dto';
import {VendorsService} from '../vendors/vendors.service';
import {
  EventPublisher,
  PurchaseOrderCreated,
} from '@gddy-coding-exercise/shared-events';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private prisma: PrismaService,
    private vendorsService: VendorsService,
    private eventPublisher: EventPublisher,
  ) {}

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
      include: {
        lineItems: {
          include: {
            item: {
              include: {
                parentItem: true,
              },
            },
          },
        },
      },
    });

    if (!purchaseOrder) {
      return null;
    }

    return PurchaseOrderMapper.toFullDto(purchaseOrder);
  }

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrderFullDto> {
    const vendor = await this.vendorsService.findByName(dto.vendorName);
    if (!vendor) {
      throw new BadRequestException('vendor not found');
    }

    const itemIds = [...new Set(dto.items.map((x) => x.itemId))];
    const items = await this.prisma.item.findMany({
      where: {id: {in: itemIds}},
      select: {id: true, name: true, sku: true},
    });

    if (items.length !== itemIds.length) {
      const foundIds = new Set(items.map((item) => item.id));
      const missingIds = itemIds.filter((id) => !foundIds.has(id));
      throw new BadRequestException(`items not found: ${missingIds.join(',')}`);
    }

    const now = new Date();
    const purchaseOrder = await this.prisma.purchaseOrder.create({
      data: {
        vendorName: vendor.name,
        orderDate: now,
        lineItems: {
          create: dto.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            createdAt: now,
          })),
        },
        expectedDeliveryDate: addDays(now, 3),
        createdAt: now,
      },
      include: {
        lineItems: {
          include: {
            item: {
              include: {
                parentItem: true,
              },
            },
          },
        },
      },
    });

    const fullDto = PurchaseOrderMapper.toFullDto(purchaseOrder);
    this.eventPublisher.publish<PurchaseOrderCreated>({
      eventType: 'procurement.purchase-order-created',
      data: {
        purchaseOrderId: fullDto.id,
        vendorName: fullDto.vendorName,
        items: fullDto.lineItems.map((item) => ({
          lineItemId: item.id,
          itemId: item.itemId,
          sku: item.sku,
          quantity: item.quantity,
          unitCost: item.unitCost,
        })),
        totalQuantity: fullDto.totalQuantity,
        totalCost: fullDto.totalCost,
        orderedDate: fullDto.orderDate,
        expectedDeliveryDate: fullDto.expectedDeliveryDate,
      },
    });

    return fullDto;
  }
}
