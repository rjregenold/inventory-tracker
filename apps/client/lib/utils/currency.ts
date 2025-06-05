import {Decimal} from 'decimal.js';

export function formatCurrency(val: Decimal): string {
  return `$${val.toFixed(2)}`;
}
