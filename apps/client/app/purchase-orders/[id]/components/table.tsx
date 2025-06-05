import {Decimal} from 'decimal.js';
import {PurchaseOrderLineItem} from '@/lib/services/purchase-orders';
import {formatCurrency} from '@/lib/utils/currency';

interface Props {
  lineItems: PurchaseOrderLineItem[];
  totalQuantity: number;
  totalCost: Decimal;
}

export default function Table({lineItems, totalQuantity, totalCost}: Props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Quantity</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map((lineItem) => (
          <tr key={lineItem.id}>
            <td></td>
            <td>{lineItem.quantity}</td>
            <td>{formatCurrency(lineItem.unitCost)}</td>
          </tr>
        ))}
        <tr>
          <td>Totals</td>
          <td>{totalQuantity}</td>
          <td>{formatCurrency(totalCost)}</td>
        </tr>
      </tbody>
    </table>
  );
}
