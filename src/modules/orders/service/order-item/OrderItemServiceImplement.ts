import { Inject, Injectable } from '@nestjs/common';
import { OrderItemModel } from '../../../../models/OrderItems';
import { IOrderItemRepository } from '../../repository/order-item/OrderItemRepositoryInterface';
import { IOrderItemService } from './OrderItemServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateOrderItemPayloadDto,
  FilterOrderItemDto,
  UpdateOrderItemPayloadDto,
} from '../../dto/requests/OrderItemRequestDto';

@Injectable()
export class OrderItemServiceImplementation implements IOrderItemService {
  constructor(
    @Inject(IOrderItemRepository)
    private orderItemRepository: IOrderItemRepository,
  ) {}

  async getOrderItemList(
    payload: FilterOrderItemDto,
  ): Promise<OrderItemModel[]> {
    try {
      const { limit, offset } = payload;
      const orderItems = await this.orderItemRepository.findAllByCondition(
        limit,
        offset,
        {},
      );
      return orderItems;
    } catch (error) {
      throw error;
    }
  }

  async getOrderItemDetail(id: string): Promise<OrderItemModel> {
    try {
      const orderItem = await this.orderItemRepository.findById(id);
      return orderItem;
    } catch (error) {
      throw error;
    }
  }

  async createOrderItem(
    payload: CreateOrderItemPayloadDto,
  ): Promise<OrderItemModel> {
    try {
      const params: Record<string, any> = {
        id: uuidv4(),
        ...payload,
      };
      const createdOrderItem = await this.orderItemRepository.create(params);
      return createdOrderItem;
    } catch (error) {
      throw error;
    }
  }

  async updateOrderItem(
    id: string,
    payload: UpdateOrderItemPayloadDto,
  ): Promise<OrderItemModel> {
    try {
      const updatedOrderItem = await this.orderItemRepository.update(
        id,
        payload,
      );
      return updatedOrderItem[0];
    } catch (error) {
      throw error;
    }
  }

  async deleteOrderItem(id: string): Promise<void> {
    try {
      const orderItem = await this.orderItemRepository.findById(id);
      if (!orderItem) {
        throw new Error('OrderItem not found');
      }
      this.orderItemRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  getOrderItemListByCondition(condition: any): Promise<OrderItemModel[]> {
    return this.orderItemRepository.findAllByConditionWithoutPagination(condition);   
  }

  getOrderItemByCondition(condition: any): Promise<OrderItemModel> {
    return this.orderItemRepository.fineOneByCondition(condition);
  }
}
