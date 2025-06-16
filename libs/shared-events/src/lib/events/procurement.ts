import {BaseEvent} from './base';
import {Decimal} from 'decimal.js';

export interface PurchaseOrderCreatedEvent extends BaseEvent {
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
    createdBy: string;
    approvers: string[];
  };
}

export interface PurchaseOrderStatusChangedEvent extends BaseEvent {
  eventType: 'procurement.purchase-order-status-changed';
  data: {
    purchaseOrderId: number;
    createdBy: string;
    oldStatus: string;
    newStatus: string;
  };
}

export type ProcurementEvent =
  | PurchaseOrderCreatedEvent
  | PurchaseOrderStatusChangedEvent;
