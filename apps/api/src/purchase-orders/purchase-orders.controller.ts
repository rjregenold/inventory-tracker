import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {PurchaseOrdersService} from './purchase-orders.service';
import {CreatePurchaseOrderDto} from './create-purchase-order-dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  findAll() {
    return this.purchaseOrdersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const purchaseOrder = await this.purchaseOrdersService.findOne(+id);
    if (!purchaseOrder) {
      throw new NotFoundException();
    }
    return purchaseOrder;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() dto: CreatePurchaseOrderDto) {
    return await this.purchaseOrdersService.create(dto);
  }
}
