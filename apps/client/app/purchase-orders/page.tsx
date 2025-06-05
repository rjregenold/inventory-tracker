import {Result} from '@/lib/types/result';
import {PurchaseOrderService} from '@/lib/services/purchase-orders';
import Card from './components/card';
import Error from '@/components/common/error';

export default async function Index() {
  const purchaseOrdersRes = await PurchaseOrderService.findAll();

  return Result.fold(
    purchaseOrdersRes,
    (purchaseOrders) => (
      <>
        {purchaseOrders.map((purchaseOrder) => (
          <Card purchaseOrder={purchaseOrder} key={purchaseOrder.id} />
        ))}
      </>
    ),
    (err) => <Error message={err} />,
  );
}
