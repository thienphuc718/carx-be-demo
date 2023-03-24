import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { UserModel } from '../../../models';
import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { OrderByEnum, OrderTypeEnum } from '../enum/AgentEnum';

export class FilterAgentDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    title: 'Limit',
    format: 'int32',
    default: 10,
  })
  limit: number;

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
  page: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(OrderByEnum)
  @ApiPropertyOptional({
    default: OrderByEnum.CREATED_AT,
  })
  order_by: OrderByEnum;

  @IsOptional()
  @IsEnum(OrderTypeEnum)
  @ApiPropertyOptional({
    default: OrderTypeEnum.DESC,
  })
  order_type: OrderTypeEnum;

  @IsOptional()
  @IsString()
  service_category_id?: string;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  distance?: number;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  top_agent?: boolean;

  @IsOptional()
  @IsUUID(4)
  category_id?: string;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_hidden?: boolean;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}

export class AgentPaymentMethodDto {
  @IsString()
  key: string;

  @IsNotEmpty()
  value: any;
}

export class AgentEntityDto {
  @IsString()
  id: string;

  @IsString()
  user_id: string;

  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  rating_points?: number;

  @IsOptional()
  @IsNumber()
  count_review?: number;

  @IsOptional()
  @IsArray()
  payment_method?: AgentPaymentMethodDto[];

  @IsBoolean()
  is_deleted: boolean;

  @IsOptional()
  @IsBoolean()
  top_agent?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  geo_info?: any;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsUUID(4)
  category_id?: string;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;

  @IsOptional()
  user_details?: UserModel;

  @IsOptional()
  @IsNumber()
  total_orders?: number;

  @IsOptional()
  @IsNumber()
  total_revenue?: number;

  @IsOptional()
  converted_name?: string;
}

export class CreateAgentEntityDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;
}

export class UpdateAgentEntityDto extends PartialType(
  OmitType(AgentEntityDto, [
    'id',
    'user_id',
    'is_deleted',
    'created_at',
    'updated_at',
    'user_details',
    // 'total_orders',
    // 'total_revenue',
    'converted_name'
  ] as const),
) {}

export class HideAgentDto {
  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsNotEmpty()
  @IsBoolean()
  is_hidden: boolean;
}

export class ActivateAgentDto {
  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsBoolean()  
  is_activated: boolean;
}