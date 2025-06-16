import {Decimal} from 'decimal.js';

export class PurchaseOrderLineItemDto {
  id: number;
  itemId: number;
  parentName: string;
  name: string;
  quantity: number;
  sku: string;
  unitCost: Decimal;
  lineCost: Decimal;
}

export class PurchaseOrderFullDto {
  id: number;
  vendorName: string;
  status: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  lineItems: PurchaseOrderLineItemDto[];
  totalQuantity: number;
  totalCost: Decimal;
}
