import {ApiError} from '../api/client';
import {inventoryApi} from '../api/inventory.api';
import {Result} from '../types/result';

export interface Item {
  id: number;
  name: string;
  sku: string;
}

export interface ParentItem {
  id: number;
  name: string;
  items: Item[];
}

export namespace ParentItemsService {
  export async function findAll(): Promise<Result<ParentItem[], ApiError>> {
    return inventoryApi.get<ParentItem[]>('/parent-items');
  }
}
