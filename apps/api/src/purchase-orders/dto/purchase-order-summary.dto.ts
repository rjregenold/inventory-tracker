import {Decimal} from 'decimal.js';

export class PurchaseOrderSummaryDto {
  id: number;
  vendorName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  totalQuantity: number;
  totalCost: Decimal;
}
