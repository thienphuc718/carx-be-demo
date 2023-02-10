import { OrderItemModel } from '../../../../models';
import { OrderEntityDto } from '../../dto/entities/OrderEntityDto';
import {
  CreateOrderItemPayloadDto,
  FilterOrderItemDto,
  UpdateOrderItemPayloadDto,
} from '../../dto/requests/OrderItemRequestDto';

export interface IOrderItemService {
  getOrderItemList(
    payload: FilterOrderItemDto,
  ): Promise<OrderItemModel[]>;
  getOrderItemDetail(id: string): Promise<OrderItemModel>;
  createOrderItem(
    payload: CreateOrderItemPayloadDto,
  ): Promise<OrderItemModel>;
  updateOrderItem(
    id: string,
    payload: UpdateOrderItemPayloadDto,
  ): Promise<OrderItemModel>;
  deleteOrderItem(id: string): Promise<void>;
  getOrderItemListByCondition(condition: any): Promise<OrderItemModel[]>
  getOrderItemByCondition(condition: any): Promise<OrderItemModel>
}

export const IOrderItemService = Symbol('IOrderItemService');
