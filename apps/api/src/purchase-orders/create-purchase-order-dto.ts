import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {Decimal} from '@prisma/client/runtime';

export class PurchaseOrderItemDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @Transform(({value}) => new Decimal(value))
  unitCost: Decimal;
}

export class CreatePurchaseOrderDto {
  @IsString()
  vendorName: string;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];
}
