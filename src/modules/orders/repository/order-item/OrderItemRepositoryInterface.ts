import { OrderItemModel } from "../../../../models";
import { UpdateOrderItemPayloadDto } from "../../dto/requests/OrderItemRequestDto";


export interface IOrderItemRepository {
  findAll(): Promise<OrderItemModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<OrderItemModel[]>;
  findAllByConditionWithoutPagination(condition: any): Promise<OrderItemModel[]>;
  findById(id: string): Promise<OrderItemModel>;
  create(payload: any): Promise<OrderItemModel>;
  update(id: string, payload: UpdateOrderItemPayloadDto): Promise<OrderItemModel[]>;
  delete(id: string): void;
  fineOneByCondition(condition: any): Promise<OrderItemModel>;
}

export const IOrderItemRepository = Symbol('IOrderItemRepository');
