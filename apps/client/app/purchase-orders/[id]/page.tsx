'use client';
import Error from '@/components/common/error';
import {
  safePurchaseOrderId,
  PurchaseOrderService,
  PurchaseOrderFull,
} from '@/lib/services/purchase-orders.service';
import {Result} from '@/lib/types/result';
import {notFound} from 'next/navigation';
import Detail from './components/detail';
import {useEffect, useState} from 'react';
import Loading from '../loading';
import {PermissionGuard} from '@/components/permission-guard';
import {useAuth} from '@/lib/contexts/auth-context';

interface Props {
  params: {id: string};
}

export default function Page(props: Props) {
  const {user} = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchaseOrderRes, setPurchaseOrderRes] = useState<Result<
    PurchaseOrderFull,
    string
  > | null>(null);

  const idRes = safePurchaseOrderId(props.params.id);
  if (Result.isErr(idRes)) {
    notFound();
  }

  const id = idRes.data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchPurchaseOrder = async () => {
      setLoading(true);
      const result = await PurchaseOrderService.findOne(id);
      setPurchaseOrderRes(result);
      setLoading(false);
    };

    fetchPurchaseOrder();
  }, [id, isMounted, user]);

  const onApprove = async (purchaseOrder: PurchaseOrderFull) => {
    if (confirm('Are you sure you want to approve this purchase order?')) {
      setPurchaseOrderRes(await PurchaseOrderService.approve(purchaseOrder.id));
    }
  };

  const onDeny = async (purchaseOrder: PurchaseOrderFull) => {
    if (confirm('Are you sure you want to deny this purchase order?')) {
      setPurchaseOrderRes(await PurchaseOrderService.deny(purchaseOrder.id));
    }
  };

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <PermissionGuard action="read" resource="purchase_order">
      {loading && <Loading />}
      {purchaseOrderRes &&
        Result.fold(
          purchaseOrderRes,
          (purchaseOrder) => (
            <Detail
              purchaseOrder={purchaseOrder}
              onApprove={() => onApprove(purchaseOrder)}
              onDeny={() => onDeny(purchaseOrder)}
            />
          ),
          (err) => <Error message={err} />,
        )}
    </PermissionGuard>
  );
}
