import { OrderModel } from '../../../../models/Orders';
import { UpdateOrderPayloadDto } from '../../dto/requests/OrderRequestDto';

export interface IOrderRepository {
  findAll(): Promise<OrderModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<OrderModel[]>;
  findById(id: string): Promise<OrderModel>;
  create(payload: any): Promise<OrderModel>;
  update(id: string, payload: UpdateOrderPayloadDto): Promise<OrderModel[]>;
  delete(id: string): void;
  countByCondition(condition: any): Promise<number>;
  sumByCondition(condition: any): Promise<number>;
  findAllByConditionWithoutPagination(condition: any): Promise<OrderModel[]>;
}

export const IOrderRepository = Symbol('IOrderRepository');
