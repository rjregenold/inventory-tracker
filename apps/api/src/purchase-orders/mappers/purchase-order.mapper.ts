import {Prisma, PurchaseOrder, PurchaseOrderLineItem} from '@prisma/client';
import {PurchaseOrderSummaryDto} from '../dto/purchase-order-summary.dto';
import {PurchaseOrderCalculations} from '../utils/purchase-order-calculations';
import {PurchaseOrderFullDto} from '../dto/purchase-order-full.dto';

type PurchaseOrderWithDetails = Prisma.PurchaseOrderGetPayload<{
  include: {
    lineItems: {
      include: {
        item: {
          include: {
            parentItem: true;
          };
        };
      };
    };
  };
}>;

type PurchaseOrderWithLineItemsSummary = PurchaseOrder & {
  lineItems: Pick<PurchaseOrderLineItem, 'quantity' | 'unitCost'>[];
};

export class PurchaseOrderMapper {
  static toSummaryDto(
    purchaseOrder: PurchaseOrderWithLineItemsSummary,
  ): PurchaseOrderSummaryDto {
    return {
      id: purchaseOrder.id,
      vendorName: purchaseOrder.vendorName,
      orderDate: purchaseOrder.orderDate,
      expectedDeliveryDate: purchaseOrder.expectedDeliveryDate,
      totalQuantity: PurchaseOrderCalculations.totalQuantity(
        purchaseOrder.lineItems,
      ),
      totalCost: PurchaseOrderCalculations.totalCost(purchaseOrder.lineItems),
    };
  }

  static toFullDto(
    purchaseOrder: PurchaseOrderWithDetails,
  ): PurchaseOrderFullDto {
    return {
      id: purchaseOrder.id,
      vendorName: purchaseOrder.vendorName,
      orderDate: purchaseOrder.orderDate,
      expectedDeliveryDate: purchaseOrder.expectedDeliveryDate,
      lineItems: purchaseOrder.lineItems.map((lineItem) => ({
        id: lineItem.id,
        itemId: lineItem.itemId,
        name: lineItem.item.name,
        parentName: lineItem.item.parentItem.name,
        quantity: lineItem.quantity,
        unitCost: lineItem.unitCost,
        lineCost: lineItem.unitCost.mul(lineItem.quantity),
      })),
      totalQuantity: PurchaseOrderCalculations.totalQuantity(
        purchaseOrder.lineItems,
      ),
      totalCost: PurchaseOrderCalculations.totalCost(purchaseOrder.lineItems),
    };
  }
}
