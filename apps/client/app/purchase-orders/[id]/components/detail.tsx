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
      <Link href="/purchase-orders" className="text-sm">
        &laquo; Back to all orders
      </Link>
      <h2 className="text-2xl my-4">Purchase Order Details</h2>
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
      <h3 className="text-xl my-4">Line Items</h3>
      <Table
        lineItems={purchaseOrder.lineItems}
        totalQuantity={purchaseOrder.totalQuantity}
        totalCost={purchaseOrder.totalCost}
      />
    </>
  );
}
