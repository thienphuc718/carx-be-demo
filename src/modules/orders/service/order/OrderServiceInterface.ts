import {
  OrderPayloadDto,
  FilterOrderDto,
  UpdateOrderItemsPriceDto,
  GetCountOrderByEachStatusDto,
} from '../../dto/requests/OrderRequestDto';
import { OrderModel } from '../../../../models/Orders';

export interface IOrderService {
  getOrderList(payload: FilterOrderDto): Promise<OrderModel[]>;
  getOrderDetail(id: string): Promise<OrderModel>;
  createOrder(payload: OrderPayloadDto, userId: string, isBooking?: boolean): Promise<OrderModel>;
  updateOrder(id: string, payload: OrderPayloadDto): Promise<OrderModel>;
  updateOrderItems(
    orderId: string,
    orderItems: UpdateOrderItemsPriceDto[],
  ): Promise<OrderModel>;
  deleteOrder(id: string): Promise<void>;
  cancelOrder(id: string, reason: string, userId: string): Promise<OrderModel>;
  processOrderItemData(orderItems: any[]): Promise<any[]>;
  countOrderByCondition(condition: any): Promise<number>;
  sumOrderByCondition(condition: any): Promise<number>;
  reportOrder(id: string, reason: string): Promise<OrderModel>
  getOrderListByConditionWithoutPagination(condition: any): Promise<OrderModel[]>
  getOrderListByConditionWithoutPaginationUsingQueryBuilder(
    condition: any,
  ): Promise<OrderModel[]>
  totalOrdersByEachStatus(condition: GetCountOrderByEachStatusDto): Promise<any>
  sendDataToInsuranceCompany(order: OrderModel): Promise<void>
}

export const IOrderService = Symbol('IOrderService');
