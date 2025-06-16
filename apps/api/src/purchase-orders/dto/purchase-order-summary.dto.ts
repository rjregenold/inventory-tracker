import {Decimal} from 'decimal.js';

export class PurchaseOrderSummaryDto {
  id: number;
  vendorName: string;
  status: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  totalQuantity: number;
  totalCost: Decimal;
}
