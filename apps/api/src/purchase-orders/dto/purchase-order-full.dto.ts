import {Decimal} from 'decimal.js';

export class PurchaseOrderLineItemDto {
  id: number;
  itemId: number;
  quantity: number;
  unitCost: Decimal;
}

export class PurchaseOrderFullDto {
  id: number;
  vendorName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  lineItems: PurchaseOrderLineItemDto[];
  totalQuantity: number;
  totalCost: Decimal;
}
