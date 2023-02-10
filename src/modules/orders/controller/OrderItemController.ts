import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IOrderItemService } from '../service/order-item/OrderItemServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';
import {
  CreateOrderItemPayloadDto,
  FilterOrderItemDto,
  UpdateOrderItemPayloadDto,
} from '../dto/requests/OrderItemRequestDto';

@ApiTags('Order Items')
@ApiExcludeController()
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('/v1/order-items')
export class OrderItemController extends BaseController {
  constructor(
    @Inject(IOrderItemService)
    private readonly orderItemService: IOrderItemService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Order Items' })
  async getAllOrderItems(
    @Res() response: express.Response,
    @Query() getOrderItemsDto: FilterOrderItemDto,
  ) {
    try {
      const orderItems = await this.orderItemService.getOrderItemList(
        getOrderItemsDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: orderItems,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Order Item Detail' })
  async getOrderItemDetail(
    @Res() response: express.Response,
    @Param('id') orderItemId: string,
  ) {
    try {
      const orderItem = await this.orderItemService.getOrderItemDetail(
        orderItemId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: orderItem,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create Order Item' })
  async createNewOrderItem(
    @Res() response: express.Response,
    @Body() CreateOrderItemPayloadDto: CreateOrderItemPayloadDto,
  ) {
    try {
      const createdOrderItem = await this.orderItemService.createOrderItem(
        CreateOrderItemPayloadDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdOrderItem,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Order Item' })
  async updateOrderItem(
    @Res() response: express.Response,
    @Body() UpdateOrderItemPayloadDto: UpdateOrderItemPayloadDto,
    @Param('id') orderItemId: string,
  ) {
    try {
      const updatedOrderItem = await this.orderItemService.updateOrderItem(
        orderItemId,
        UpdateOrderItemPayloadDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedOrderItem,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete A Order Item' })
  async deleteOrderItem(
    @Res() response: express.Response,
    @Param('id') orderItemId: string,
  ) {
    try {
      await this.orderItemService.deleteOrderItem(orderItemId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a order item',
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
