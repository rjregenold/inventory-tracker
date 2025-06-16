import {Result} from '@/lib/types/result';
import {PurchaseOrderService} from '@/lib/services/purchase-orders.service';
import Card from './components/card';
import Error from '@/components/common/error';
import {PermissionGuard} from '@/components/permission-guard';
import {requirePermission} from '@/lib/auth/server';

export default async function Index() {
  requirePermission('read', 'purchase_order');
  const purchaseOrdersRes = await PurchaseOrderService.findAll();

  return Result.fold(
    purchaseOrdersRes,
    (purchaseOrders) => (
      <>
        <PermissionGuard action="read" resource="purchase_order">
          {purchaseOrders.map((purchaseOrder) => (
            <Card purchaseOrder={purchaseOrder} key={purchaseOrder.id} />
          ))}
        </PermissionGuard>
      </>
    ),
    (err) => <Error message={err} />,
  );
}
