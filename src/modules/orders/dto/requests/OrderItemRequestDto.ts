import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { OrderItemEntityDto } from '../entities/OrderItemEntityDto';

export class FilterOrderItemDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;
}

export class OrderItemPayloadDto extends OmitType(OrderItemEntityDto, [
  'order_id',
  'price',
  'image',
] as const) {}

export class CreateOrderItemPayloadDto extends OrderItemEntityDto {}

export class UpdateOrderItemPayloadDto extends OmitType(OrderItemEntityDto, [
  'order_id',
  'product_sku',
  'quantity',
] as const) {
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
