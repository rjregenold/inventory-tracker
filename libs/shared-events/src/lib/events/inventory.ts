import {BaseEvent} from './base';

export interface InventoryExpectedEvent extends BaseEvent {
  eventType: 'inventory.expected';
  data: {
    itemId: number;
    sku: string;
    quantity: number;
    orderedDate: string;
    expectedDeliveryDate: string;
    source: 'purchase-order' | 'transfer';
  };
}

export interface InventoryReceivedEvent extends BaseEvent {
  eventType: 'inventory.received';
  data: {
    itemId: number;
    sku: string;
    quantity: number;
    purchaseOrderId?: number;
    receivedDate: string;
  };
}

export type InventoryEvent = InventoryExpectedEvent | InventoryReceivedEvent;
