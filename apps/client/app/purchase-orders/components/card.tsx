import {ReactNode} from 'react';
import {differenceInDays} from 'date-fns';
import {PurchaseOrderSummary} from '@/lib/services/purchase-orders.service';
import {formatCurrency} from '@/lib/utils/currency';
import {formatDate} from '@/lib/utils/date';
import Link from 'next/link';
import TrackButton from './track-button';
import ContactButton from './contact-button';

interface Props {
  purchaseOrder: PurchaseOrderSummary;
}

enum Urgency {
  High,
  Medium,
  Low,
}

function getUrgency(deliveryDate: Date, now: Date): Urgency {
  const daysUntil = differenceInDays(deliveryDate, now);
  if (daysUntil < 0) return Urgency.High;
  if (daysUntil < 3) return Urgency.Medium;
  return Urgency.Low;
}

export default function Card({purchaseOrder}: Props) {
  const renderMeta = (name: string, value: ReactNode) => (
    <div>
      <span className="text-xs uppercase">{name}</span>
      <div>{value}</div>
    </div>
  );

  const urgency = getUrgency(purchaseOrder.expectedDeliveryDate, new Date());

  return (
    <div className="my-8 shadow-md rounded-md">
      <div className="bg-base-300 text-gray-400 p-4 rounded-t-md">
        <div className="flex justify-between">
          <div className="flex justify-between w-1/2">
            {renderMeta('Order Placed', formatDate(purchaseOrder.orderDate))}
            {renderMeta('Total', formatCurrency(purchaseOrder.totalCost))}
            {renderMeta('Quantity', purchaseOrder.totalQuantity)}
            {renderMeta(
              'Status',
              <span className="capitalize">{purchaseOrder.status}</span>,
            )}
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
          <div className="flex items-center">
            <h3 className="text-xl font-bold mr-1">
              Expected {formatDate(purchaseOrder.expectedDeliveryDate)}
            </h3>
            {urgency === Urgency.High && (
              <div className="badge badge-sm badge-error">overdue</div>
            )}
            {urgency === Urgency.Medium && (
              <div className="badge badge-sm badge-warning">arriving soon</div>
            )}
          </div>
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
