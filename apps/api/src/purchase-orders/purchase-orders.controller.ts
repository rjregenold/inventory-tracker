import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {PurchaseOrdersService} from './purchase-orders.service';
import {CreatePurchaseOrderDto} from './create-purchase-order-dto';
import {AuthGuard} from '@nestjs/passport';
import {Permission, PermissionGuard} from '../auth/permission.guard';
import {CurrentUser} from '../auth/user.decorator';
import {JwtPayload} from '../auth/jwt.strategy';

@Controller('purchase-orders')
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  @Permission('read', 'purchase_order')
  findAll() {
    return this.purchaseOrdersService.findAll();
  }

  @Get(':id')
  @Permission('read', 'purchase_order')
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
  @Permission('create', 'purchase_order')
  async create(
    @Body() dto: CreatePurchaseOrderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.purchaseOrdersService.create(dto, user);
  }

  @Put(':id/approve')
  @Permission('approve', 'purchase_order')
  async approve(@Param('id') id: string) {
    return this.purchaseOrdersService.updateApprovalStatus(+id, 'approved');
  }

  @Put(':id/deny')
  @Permission('approve', 'purchase_order')
  async deny(@Param('id') id: string) {
    return await this.purchaseOrdersService.updateApprovalStatus(+id, 'denied');
  }
}
