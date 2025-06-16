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
  PurchaseOrderCreatedEvent,
  PurchaseOrderStatusChangedEvent,
} from '@gddy-coding-exercise/shared-events';
import {UsersService} from '../users/users.service';
import {JwtPayload} from '../auth/jwt.strategy';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private prisma: PrismaService,
    private vendorsService: VendorsService,
    private eventPublisher: EventPublisher,
    private usersService: UsersService,
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

  async create(
    dto: CreatePurchaseOrderDto,
    user: JwtPayload,
  ): Promise<PurchaseOrderFullDto> {
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
        createdById: user.id,
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
    const approvers = await this.usersService.allByRole('purchase_approver');
    this.eventPublisher.publish<PurchaseOrderCreatedEvent>({
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
        createdBy: user.email,
        approvers: approvers.map((x) => x.email),
      },
    });

    return fullDto;
  }

  async updateApprovalStatus(
    id: number,
    status: string,
  ): Promise<PurchaseOrderFullDto> {
    const oldOrder = await this.prisma.purchaseOrder.findUnique({
      where: {id},
      select: {
        status: true,
      },
    });

    if (!oldOrder) return null;

    const purchaseOrder = await this.prisma.purchaseOrder.update({
      where: {id},
      data: {
        status,
      },
      include: {
        createdBy: true,
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

    this.eventPublisher.publish<PurchaseOrderStatusChangedEvent>({
      eventType: 'procurement.purchase-order-status-changed',
      data: {
        purchaseOrderId: purchaseOrder.id,
        createdBy: purchaseOrder.createdBy.email,
        oldStatus: oldOrder.status,
        newStatus: purchaseOrder.status,
      },
    });

    return PurchaseOrderMapper.toFullDto(purchaseOrder);
  }
}
