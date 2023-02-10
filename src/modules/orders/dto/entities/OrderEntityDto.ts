import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { OrderStatusEnum, OrderTypeEnum } from '../../enum/OrderEnum';
import { TransportationMethodEnum } from '../../enum/TransportationEnum';
import { PaymentMethodEnum } from '../../enum/PaymentEnum';
import { Transform, Type } from 'class-transformer';
import { OrderInsuranceType } from '../requests/OrderRequestDto';
import {ApiPropertyOptional} from "@nestjs/swagger";

export class OrderEntityDto {
  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsString()
  transaction_id?: string;

  @IsOptional()
  @IsString()
  tracking_code?: string;

  @IsString()
  @IsNotEmpty()
  customer_id: string;

  @IsString()
  @IsNotEmpty()
  agent_id: string;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @IsNotEmpty()
  @IsEnum(OrderTypeEnum)
  type: OrderTypeEnum;

  @IsOptional()
  @IsString()
  agent_promotion_code?: string;

  @IsOptional()
  @IsString()
  carx_promotion_code?: string;

  @IsOptional()
  @IsString()
  invoice_image?: string;

  @IsOptional()
  @IsEnum(TransportationMethodEnum)
  transportation_method?: TransportationMethodEnum;

  @IsOptional()
  @IsEnum(PaymentMethodEnum)
  payment_method?: PaymentMethodEnum;

  @IsDate()
  created_at?: Date;

  @IsDate()
  updated_at?: Date;

  @IsBoolean()
  is_deleted: boolean;

  @IsBoolean()
  @IsOptional()
  is_vat_exported?: boolean;

  @IsOptional()
  @IsBoolean()
  is_customer_point_applied?: boolean;

  @IsOptional()
  @IsNumber()
  initial_value?: number;

  @IsOptional()
  @IsNumber()
  vat_value_applied?: number;

  @IsOptional()
  @IsNumber()
  promotion_value_applied?: number;

  @IsOptional()
  @IsNumber()
  point_value_applied?: number;

  @IsOptional()
  @IsNumber()
  point_used?: number;

  @IsOptional()
  vat_image?: string;

  @IsOptional()
  address?: Record<string, any>;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_insurance_order?: boolean;

  @ApiPropertyOptional({ type: OrderInsuranceType })
  @IsOptional()
  @Type(() => OrderInsuranceType)
  @IsObject()
  @ValidateNested({ each: true })
  insurance_info?: OrderInsuranceType;
}
