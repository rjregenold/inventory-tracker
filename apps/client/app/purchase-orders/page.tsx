import {Result} from '@/lib/types/result';
import {PurchaseOrderService} from '@/lib/services/purchase-orders';
import Table from './components/table';
import Error from '@/components/common/error';

export default async function Index() {
  const purchaseOrdersRes = await PurchaseOrderService.findAll();

  return (
    <>
      <h1 className="text-2xl">Purchase Orders</h1>
      {Result.isOk(purchaseOrdersRes) && (
        <Table purchaseOrders={purchaseOrdersRes.data} />
      )}
      {Result.isErr(purchaseOrdersRes) && (
        <Error message={purchaseOrdersRes.error} />
      )}
    </>
  );
}
