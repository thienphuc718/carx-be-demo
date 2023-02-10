import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum, IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { OrderItemPayloadDto } from './OrderItemRequestDto';
import { OrderEntityDto } from '../entities/OrderEntityDto';
import { OrderStatusEnum, OrderTypeEnum } from '../../enum/OrderEnum';
import { IsValidPromotionDate } from '../../../promotions/helper/PromotionDatesHelper';

export class FilterOrderDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    title: 'Limit',
    format: 'int32',
    default: 10,
  })
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 10000,
    title: 'Limit',
    format: 'int32',
    default: 1,
  })
  page?: number;

  @IsOptional()
  @IsUUID(4)
  @ApiPropertyOptional()
  customer_id?: string;

  @IsOptional()
  @IsUUID(4)
  @ApiPropertyOptional()
  agent_id?: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @IsOptional()
  @IsEnum(OrderTypeEnum)
  type?: OrderTypeEnum;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  is_insurance_order?: boolean;
}

export class OrderPayloadDto extends OmitType(OrderEntityDto, [
  'customer_id',
  'agent_id',
  'type',
  'is_deleted',
] as const) {
  @IsArray()
  @IsOptional()
  order_items?: OrderItemPayloadDto[];

  @IsOptional()
  @IsUUID(4)
  customer_id?: string;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsEnum(OrderTypeEnum)
  type?: OrderTypeEnum;

  @IsOptional()
  @IsString()
  cancel_reason?: string;

  @IsOptional()
  @IsString()
  report_reason?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  is_vat_exported?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  is_customer_point_applied?: boolean;
}

export class CreateOrderPayloadDto extends OmitType(OrderPayloadDto, [
  'value',
  'transaction_id',
  'tracking_code',
  'status',
  'order_items',
  'created_at',
  'updated_at',
  'type',
  'customer_id',
  'agent_id',
  'cancel_reason',
  'report_reason',
  'initial_value',
  'promotion_value_applied',
  'vat_value_applied',
  'point_value_applied',
  'point_used',
  'vat_image',
] as const) {
  @IsArray()
  @IsNotEmpty()
  order_items: OrderItemPayloadDto[];

  @IsNotEmpty()
  @IsUUID(4)
  agent_id: string;
}

export class UpdateOrderPayloadDto extends PartialType(
  OmitType(CreateOrderPayloadDto, ['agent_id'] as const),
) {
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @IsOptional()
  @IsString()
  cancel_reason?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  is_vat_exported?: boolean;

  @IsOptional()
  @IsString()
  invoice_image?: string;

  @IsOptional()
  @IsString()
  vat_image?: string;
}

export class CancelOrderPayloadDto {
  @IsNotEmpty()
  @IsString()
  cancel_reason: string;
}

export class UpdateOrderItemsPriceDto {
  @IsNotEmpty()
  @IsString()
  order_item_id: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  product_id: string;
}

export class UpdateOrderItemsPayload {
  @IsNotEmpty()
  @IsArray()
  order_items: UpdateOrderItemsPriceDto[];
}

export class ReportOrderPayloadDto {
  @IsNotEmpty()
  @IsString()
  report_reason: string;
}

export class GetCountOrderByEachStatusDto {
  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsUUID(4)
  customer_id?: string;
}

export class OrderInsuranceType {
  @IsNotEmpty()
  customer_name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsNotEmpty()
  certificate_number: string;

  @IsOptional()
  rgst_no?: string;

  @IsNotEmpty()
  frame_no: string;

  @IsNotEmpty()
  engine_no: string;

  @IsNotEmpty()
  car_type_code: string;

  @IsNotEmpty()
  usage_code: string;

  @IsNotEmpty()
  @IsValidPromotionDate()
  start_date: string;

  @IsNotEmpty()
  @IsInt()
  @Max(2)
  @Min(1)
  insurance_time: number;

  @IsNotEmpty()
  @IsInt()
  capacity: number;

  @IsOptional()
  @IsString()
  carx_contract_number?: string;
}
