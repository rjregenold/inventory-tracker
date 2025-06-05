import {Decimal} from 'decimal.js';

export interface LineItemWithCost {
  quantity: number;
  unitCost: Decimal;
}

export class PurchaseOrderCalculations {
  static totalQuantity(
    lineItems: Pick<LineItemWithCost, 'quantity'>[],
  ): number {
    return lineItems.reduce((acc, lineItem) => acc + lineItem.quantity, 0);
  }

  static totalCost(lineItems: LineItemWithCost[]): Decimal {
    return lineItems.reduce(
      (acc, lineItem) => acc.add(lineItem.unitCost.mul(lineItem.quantity)),
      new Decimal(0),
    );
  }
}
