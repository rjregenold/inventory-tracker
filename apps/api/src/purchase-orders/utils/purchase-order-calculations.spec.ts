import {Decimal} from 'decimal.js';
import {PurchaseOrderCalculations} from './purchase-order-calculations';

describe('PurchaseOrderCalculations', () => {
  describe('totalQuantity', () => {
    it('should calculate total quantity correctly', () => {
      const lineItems = [{quantity: 5}, {quantity: 10}, {quantity: 3}];

      const result = PurchaseOrderCalculations.totalQuantity(lineItems);

      expect(result).toBe(18);
    });

    it('should return 0 for empty array', () => {
      const result = PurchaseOrderCalculations.totalQuantity([]);
      expect(result).toBe(0);
    });
  });

  describe('totalCost', () => {
    it('should calculate total cost with Decimal values', () => {
      const lineItems = [
        {quantity: 2, unitCost: new Decimal('10.50')},
        {quantity: 3, unitCost: new Decimal('15.25')},
      ];

      const result = PurchaseOrderCalculations.totalCost(lineItems);

      expect(result).toStrictEqual(new Decimal('66.75')); // (2 * 10.50) + (3 * 15.25)
    });

    it('should return 0 for empty array', () => {
      const result = PurchaseOrderCalculations.totalCost([]);
      expect(result).toStrictEqual(new Decimal(0));
    });

    it('should handle decimal precision correctly', () => {
      const lineItems = [{quantity: 3, unitCost: new Decimal('0.10')}];

      const result = PurchaseOrderCalculations.totalCost(lineItems);

      expect(result).toStrictEqual(new Decimal('0.3')); // No floating point errors
    });
  });
});
