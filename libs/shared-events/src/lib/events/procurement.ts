import {BaseEvent} from './base';

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
      unitCost: string;
    }>;
    totalQuantity: number;
    totalCost: string;
    orderDate: string;
    expectedDeliveryDate: string;
  };
}

export type ProcurementEvent = PurchaseOrderCreated;
