import DescriptionList from '@/components/ui/description-list';
import {PurchaseOrderFull} from '@/lib/services/purchase-orders';
import {formatDate} from '@/lib/utils/date';
import Link from 'next/link';
import Table from './table';

interface Props {
  purchaseOrder: PurchaseOrderFull;
}

export default function Detail({purchaseOrder}: Props) {
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
        </div>
      </div>
      <div className="card bg-gray-400 text-gray-900">
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
