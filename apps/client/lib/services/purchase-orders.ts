import {Decimal} from 'decimal.js';
import {inventoryApi} from '../api/inventory';
import {Result} from '../types/result';

type PurchaseOrderId = Brand<number, 'PurchaseOrderId'>;
const PurchaseOrderId = (id: number): PurchaseOrderId => id as PurchaseOrderId;
const unwrapPurchaseOrderId = (id: PurchaseOrderId): number => id as number;

interface PurchaseOrderSummaryApi {
  id: number;
  vendorName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  totalQuantity: number;
  totalCost: string;
}

export interface PurchaseOrderSummary {
  id: PurchaseOrderId;
  vendorName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  totalQuantity: number;
  totalCost: Decimal;
}

function transformSummary(
  api: PurchaseOrderSummaryApi,
): Result<PurchaseOrderSummary, string> {
  try {
    return Result.ok({
      ...api,
      id: PurchaseOrderId(api.id),
      orderDate: new Date(api.orderDate),
      expectedDeliveryDate: new Date(api.expectedDeliveryDate),
      totalCost: new Decimal(api.totalCost),
    });
  } catch (e) {
    console.error('failed to transform summary', e);
    return Result.err('invalid data');
  }
}

export interface PurchaseOrderLineItem {
  id: number;
  itemId: number;
  quantity: number;
  unitCost: Decimal;
}

export interface PurchaseOrderFull {
  id: PurchaseOrderId;
  vendorName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  lineItems: PurchaseOrderLineItem[];
  totalQuantity: number;
  totalCost: Decimal;
}

export class PurchaseOrderService {
  static async findAll(): Promise<Result<PurchaseOrderSummary[], string>> {
    const res =
      await inventoryApi.get<PurchaseOrderSummaryApi[]>('/purchase-orders');
    return Result.biFlatMap(
      res,
      (xs) => Result.collect(xs.map(transformSummary)),
      (e) => `API Error: ${e.message}`,
    );
  }

  static async findOne(id: PurchaseOrderId) {
    return await inventoryApi.get<PurchaseOrderFull>(
      `/purchase-orders/${unwrapPurchaseOrderId(id)}`,
    );
  }
}
