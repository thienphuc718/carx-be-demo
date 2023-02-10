import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IOrderService } from '../service/order/OrderServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';
import {
  CancelOrderPayloadDto,
  CreateOrderPayloadDto,
  FilterOrderDto,
  GetCountOrderByEachStatusDto,
  ReportOrderPayloadDto,
  UpdateOrderItemsPayload,
  UpdateOrderPayloadDto,
} from '../dto/requests/OrderRequestDto';
import {OrderTypeEnum} from "../enum/OrderEnum";

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('/v1/orders')
export class OrderController extends BaseController {
  constructor(
    @Inject(IOrderService)
    private readonly orderService: IOrderService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Orders' })
  async getAllOrders(
    @Res() response: express.Response,
    @Query() getOrdersDto: FilterOrderDto,
  ) {
    try {
      const orders = await this.orderService.getOrderList(getOrdersDto);
      const total = await this.orderService.countOrderByCondition({ ...getOrdersDto, type: OrderTypeEnum.PHYSICAL_PURCHASED });
      const data = orders.map((order) => order.transformToResponse());
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          order_list: data,
          total: total,
        },
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

  @Get('/total/each-status')
  @ApiOperation({ summary: 'Get Order Count By Each Status' })
  async getOrderCountsByStatus(
    @Res() response: express.Response,
    @Query() getOrdersDto: GetCountOrderByEachStatusDto,
  ) {
    try {
      const data = await this.orderService.totalOrdersByEachStatus(
        getOrdersDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: data,
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
  @ApiOperation({ summary: 'Get Order Detail' })
  async getOrderDetail(
    @Res() response: express.Response,
    @Param('id') orderId: string,
  ) {
    try {
      const order = await this.orderService.getOrderDetail(orderId);
      if (!order) {
        const err = Result.fail({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Order not found or has been deleted',
        });
        return this.fail(response, err.error);
      }
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: order.transformToResponse(),
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
  @ApiOperation({ summary: 'Create Order' })
  async createNewOrder(
    @Res() response: express.Response,
    @Body() createOrderPayloadDto: CreateOrderPayloadDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdOrder = await this.orderService.createOrder(
        createOrderPayloadDto,
        request.user.id,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdOrder.transformToResponse(),
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

  @Put(':id/order-items')
  @ApiOperation({ summary: 'Update Order items price' })
  async updateOrderItems(
    @Res() response: express.Response,
    @Body() updateOrderItemsPayload: UpdateOrderItemsPayload,
    @Param('id') orderId: string,
  ) {
    try {
      const updatedOrder = await this.orderService.updateOrderItems(
        orderId,
        updateOrderItemsPayload.order_items,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Cancel order successfully',
        data: updatedOrder.transformToResponse(),
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

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel Order' })
  async cancelOrder(
    @Res() response: express.Response,
    @Body() cancelOrderPayloadDto: CancelOrderPayloadDto,
    @Param('id') orderId: string,
    @Req() request: express.Request,
  ) {
    try {
      const userId = request.user.id;
      const canceledOrder = await this.orderService.cancelOrder(
        orderId,
        cancelOrderPayloadDto.cancel_reason,
        userId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Cancel order successfully',
        data: canceledOrder,
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

  @Patch(':id/report')
  @ApiOperation({ summary: 'Report Order' })
  async reportOrder(
    @Res() response: express.Response,
    @Body() reportOrderPayloadDto: ReportOrderPayloadDto,
    @Param('id') orderId: string,
  ) {
    try {
      const reportedOrder = await this.orderService.reportOrder(
        orderId,
        reportOrderPayloadDto.report_reason,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Report order successfully',
        data: reportedOrder,
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
  @ApiOperation({ summary: 'Update Order' })
  async updateOrder(
    @Res() response: express.Response,
    @Body() UpdateOrderPayloadDto: UpdateOrderPayloadDto,
    @Param('id') orderId: string,
  ) {
    try {
      const updatedOrder = await this.orderService.updateOrder(
        orderId,
        UpdateOrderPayloadDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedOrder,
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
  @ApiOperation({ summary: 'Delete A Order' })
  async deleteOrder(
    @Res() response: express.Response,
    @Param('id') orderId: string,
  ) {
    try {
      await this.orderService.deleteOrder(orderId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a order',
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
