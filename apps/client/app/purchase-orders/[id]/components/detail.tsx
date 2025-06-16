import DescriptionList from '@/components/ui/description-list';
import {formatDate} from '@/lib/utils/date';
import Link from 'next/link';
import Table from './table';
import {PurchaseOrderFull} from '@/lib/services/purchase-orders.service';
import {useAuth} from '@/lib/contexts/auth-context';

interface Props {
  purchaseOrder: PurchaseOrderFull;
  onApprove: () => void;
  onDeny: () => void;
}

export default function Detail({purchaseOrder, onApprove, onDeny}: Props) {
  const {hasPermission} = useAuth();

  return (
    <>
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <Link href="/purchase-orders" className="link">
              Purchase Orders
            </Link>
          </li>
          <li>Order Details</li>
        </ul>
      </div>
      <div className="card bg-gray-400 text-gray-900 mb-4">
        <div className="card-body">
          <h2 className="card-title">Order Details</h2>
          <DescriptionList
            items={[
              {
                term: 'Status',
                value: (
                  <span className="capitalize">{purchaseOrder.status}</span>
                ),
              },
              {term: 'Order Number', value: purchaseOrder.id},
              {term: 'Order Date', value: formatDate(purchaseOrder.orderDate)},
              {
                term: 'Expected Delivery Date',
                value: formatDate(purchaseOrder.expectedDeliveryDate),
              },
              {term: 'Vendor Name', value: purchaseOrder.vendorName},
              {term: 'Line Item Count', value: purchaseOrder.lineItems.length},
            ]}
          />
          {hasPermission('approve', 'purchase_order') &&
            purchaseOrder.status === 'pending' && (
              <div className="card-actions">
                <button className="btn btn-primary" onClick={() => onApprove()}>
                  Approve
                </button>
                <button className="btn btn-danger" onClick={() => onDeny()}>
                  Deny
                </button>
              </div>
            )}
        </div>
      </div>
      <div className="card bg-gray-400 text-gray-900 mb-4">
        <div className="card-body">
          <div className="card-title">Line Items</div>
          <Table
            lineItems={purchaseOrder.lineItems}
            totalQuantity={purchaseOrder.totalQuantity}
            totalCost={purchaseOrder.totalCost}
          />
        </div>
      </div>
    </>
  );
}
