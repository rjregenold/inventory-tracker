import Error from '@/components/common/error';
import {
  safePurchaseOrderId,
  PurchaseOrderService,
} from '@/lib/services/purchase-orders.service';
import {Result} from '@/lib/types/result';
import {notFound} from 'next/navigation';
import Detail from './components/detail';
import {requirePermission} from '@/lib/auth/server';

interface Props {
  params: {id: string};
}

export default async function Page(props: Props) {
  requirePermission('read', 'purchase_order');

  const idRes = safePurchaseOrderId(props.params.id);
  if (Result.isErr(idRes)) {
    notFound();
  }

  const id = idRes.data;
  const purchaseOrderRes = await PurchaseOrderService.findOne(id);

  return (
    <>
      {Result.fold(
        purchaseOrderRes,
        (purchaseOrder) => (
          <Detail purchaseOrder={purchaseOrder} />
        ),
        (err) => (
          <Error message={err} />
        ),
      )}
    </>
  );
}
