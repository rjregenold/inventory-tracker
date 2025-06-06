import {ReactNode} from 'react';
import {PurchaseOrderSummary} from '@/lib/services/purchase-orders.service';
import {formatCurrency} from '@/lib/utils/currency';
import {formatDate} from '@/lib/utils/date';
import Link from 'next/link';
import TrackButton from './track-button';
import ContactButton from './contact-button';

interface Props {
  purchaseOrder: PurchaseOrderSummary;
}

export default function Card({purchaseOrder}: Props) {
  const renderMeta = (name: string, value: ReactNode) => (
    <div>
      <span className="text-xs uppercase">{name}</span>
      <div>{value}</div>
    </div>
  );

  return (
    <div className="my-8 shadow-md rounded-md">
      <div className="bg-base-300 text-gray-400 p-4 rounded-t-md">
        <div className="flex justify-between">
          <div className="flex justify-between w-1/2">
            {renderMeta('Order Placed', formatDate(purchaseOrder.orderDate))}
            {renderMeta('Total', formatCurrency(purchaseOrder.totalCost))}
            {renderMeta('Quantity', purchaseOrder.totalQuantity)}
          </div>
          <div className="text-right">
            <span className="text-xs uppercase">Order #{purchaseOrder.id}</span>
            <div>
              <Link
                href={`/purchase-orders/${purchaseOrder.id}`}
                className="link"
              >
                View order details
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-400 text-gray-900 p-4 flex rounded-b-md">
        <div className="flex-auto">
          <h3 className="text-xl font-bold">
            Expected {formatDate(purchaseOrder.expectedDeliveryDate)}
          </h3>
          <div>Shipping from {purchaseOrder.vendorName}</div>
        </div>
        <div className="flex flex-col gap-2">
          <TrackButton vendorName={purchaseOrder.vendorName} />
          <ContactButton vendorName={purchaseOrder.vendorName} />
        </div>
      </div>
    </div>
  );
}
