import {Decimal} from 'decimal.js';
import {inventoryApi} from '../api/inventory';
import {Result} from '../types/result';
import {ApiError} from '../api/client';

type PurchaseOrderId = Brand<number, 'PurchaseOrderId'>;
const PurchaseOrderId = (id: number): PurchaseOrderId => id as PurchaseOrderId;
export function safePurchaseOrderId(
  id: string,
): Result<PurchaseOrderId, string> {
  const idNum = parseInt(id);
  return Number.isNaN(idNum)
    ? Result.err('invalid purchase order id')
    : Result.ok(PurchaseOrderId(idNum));
}
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

interface PurchaseOrderLineItemApi {
  id: number;
  itemId: number;
  name: string;
  parentName: string;
  quantity: number;
  unitCost: string;
  lineCost: string;
}

export interface PurchaseOrderLineItem {
  id: number;
  itemId: number;
  name: string;
  parentName: string;
  quantity: number;
  unitCost: Decimal;
  lineCost: Decimal;
}

function transformLineItem(
  api: PurchaseOrderLineItemApi,
): Result<PurchaseOrderLineItem, string> {
  try {
    return Result.ok({
      ...api,
      unitCost: new Decimal(api.unitCost),
      lineCost: new Decimal(api.lineCost),
    });
  } catch (e) {
    console.error('failed to transform line item', e);
    return Result.err('invalid line item');
  }
}

interface PurchaseOrderFullApi {
  id: PurchaseOrderId;
  vendorName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  lineItems: PurchaseOrderLineItemApi[];
  totalQuantity: number;
  totalCost: string;
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

function transformFull(
  api: PurchaseOrderFullApi,
): Result<PurchaseOrderFull, string> {
  try {
    return Result.map(
      Result.collect(api.lineItems.map(transformLineItem)),
      (lineItems) => ({
        ...api,
        orderDate: new Date(api.orderDate),
        expectedDeliveryDate: new Date(api.expectedDeliveryDate),
        lineItems,
        totalCost: new Decimal(api.totalCost),
      }),
    );
  } catch (e) {
    console.error('failed to transform purchase order', e);
    return Result.err('invalid purchase order data');
  }
}

export namespace PurchaseOrderService {
  export async function findAll(): Promise<
    Result<PurchaseOrderSummary[], string>
  > {
    const res =
      await inventoryApi.get<PurchaseOrderSummaryApi[]>('/purchase-orders');
    return Result.biFlatMap(
      res,
      (xs) => Result.collect(xs.map(transformSummary)),
      ApiError.toString,
    );
  }

  export async function findOne(id: PurchaseOrderId) {
    const res = await inventoryApi.get<PurchaseOrderFullApi>(
      `/purchase-orders/${unwrapPurchaseOrderId(id)}`,
    );
    return Result.biFlatMap(res, transformFull, ApiError.toString);
  }
}
