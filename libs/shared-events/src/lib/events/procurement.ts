import {BaseEvent} from './base';
import {Decimal} from 'decimal.js';

export interface PurchaseOrderCreated extends BaseEvent {
  eventType: 'procurement.purchase-order-created';
  data: {
    purchaseOrderId: number;
    vendorName: string;
    items: Array<{
      lineItemId: number;
      itemId: number;
      sku: string;
      quantity: number;
      unitCost: Decimal;
    }>;
    totalQuantity: number;
    totalCost: Decimal;
    orderedDate: Date;
    expectedDeliveryDate: Date;
  };
}

export type ProcurementEvent = PurchaseOrderCreated;
