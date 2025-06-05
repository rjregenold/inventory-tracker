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
        <tr className="text-gray-900">
          <th>Item</th>
          <th>Type</th>
          <th className="text-right">Unit Cost</th>
          <th className="text-right">Quantity</th>
          <th className="text-right">Line Cost</th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map((lineItem) => (
          <tr key={lineItem.id}>
            <td>{lineItem.name}</td>
            <td>{lineItem.parentName}</td>
            <td className="text-right">{formatCurrency(lineItem.unitCost)}</td>
            <td className="text-right">{lineItem.quantity}</td>
            <td className="text-right">{formatCurrency(lineItem.lineCost)}</td>
          </tr>
        ))}
        <tr>
          <td colSpan={3}>
            <strong>Totals</strong>
          </td>
          <td className="text-right">{totalQuantity}</td>
          <td className="text-right">{formatCurrency(totalCost)}</td>
        </tr>
      </tbody>
    </table>
  );
}
