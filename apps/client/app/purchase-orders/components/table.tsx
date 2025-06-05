import {PurchaseOrderSummary} from '@/lib/services/purchase-orders';
import {formatCurrency} from '@/lib/utils/currency';
import {formatDate} from '@/lib/utils/date';

interface Props {
  purchaseOrders: PurchaseOrderSummary[];
}

export default function Table(props: Props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Number</th>
          <th>Delivery Date</th>
          <th>Vendor</th>
          <th>Quantity</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        {props.purchaseOrders.map((purchaseOrder) => (
          <tr key={purchaseOrder.id}>
            <td>{purchaseOrder.id}</td>
            <td>{formatDate(purchaseOrder.expectedDeliveryDate)}</td>
            <td>{purchaseOrder.vendorName}</td>
            <td>{purchaseOrder.totalQuantity}</td>
            <td>{formatCurrency(purchaseOrder.totalCost)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
