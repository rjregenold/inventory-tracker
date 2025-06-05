import {Decimal} from 'decimal.js';

export class PurchaseOrderLineItemDto {
  id: number;
  itemId: number;
  parentName: string;
  name: string;
  quantity: number;
  unitCost: Decimal;
  lineCost: Decimal;
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
