import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  Max,
  Min,
  IsArray,
  IsUUID,
} from 'class-validator';
import {
  CurrencyUnitEnum,
  ProductGuaranteeTimeUnitEnum,
  ProductStatusEnum,
} from '../../products/enum/ProductEnum';

export class FilterServiceDto {
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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  agent_id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsUUID(4)
  @ApiPropertyOptional()
  category_id?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  is_rescue_service?: boolean;

  @IsOptional()
  @IsUUID(4)
  agent_category_id?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    minimum: 0,
    title: 'min_price',
    format: 'int64',
    default: 0,
  })
  min_price?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    minimum: 1,
    title: 'max_price',
    format: 'int64',
    default: 10_000_000_000,
  })
  max_price?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  distance?: number;

  @Transform(({ value }) => [true, 'true'].includes(value))
  @IsOptional()
  @IsBoolean()
  is_status_included?: boolean;
}

export class KeyPairValueDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class ServiceEntityDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  other_info?: KeyPairValueDto[];

  @IsOptional()
  @IsString()
  product_id?: string;

  @IsString()
  agent_id: string;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @IsOptional()
  @IsBoolean()
  is_rescue_service?: boolean;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsOptional()
  categories?: any;

  @IsOptional()
  @IsUUID(4)
  agent_category_id?: string;

  @IsOptional()
  converted_name?: string;
}

export class ServicePayloadDto extends OmitType(ServiceEntityDto, [
  'is_deleted',
  'product_id',
  'id',
  'agent_id',
  'created_at',
  'updated_at',
  'name',
  'description',
  'agent_category_id',
] as const) {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  agent_id?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  category_ids?: string[];

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  discount_price?: number;

  @IsOptional()
  @IsEnum(CurrencyUnitEnum)
  currency_unit?: CurrencyUnitEnum;

  @IsOptional()
  @IsBoolean()
  is_guaranteed?: boolean;

  @IsOptional()
  @IsEnum(ProductGuaranteeTimeUnitEnum)
  guarantee_time_unit?: ProductGuaranteeTimeUnitEnum;

  @IsOptional()
  @IsNumber()
  guarantee_time?: number;

  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsDate()
  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsUUID(4)
  agent_category_id?: string;
}

export class CreateServiceEntityDto extends OmitType(ServiceEntityDto, [
  'id',
  'created_at',
  'updated_at',
  'name',
] as const) {}

export class CreateServicePayloadDto extends OmitType(ServicePayloadDto, [
  'id',
  'agent_id',
  'created_at',
  'updated_at',
  'categories',
  'currency_unit',
] as const) {}

export class CreateServiceCategoryRelationEntityDto {
  @IsNotEmpty()
  @IsString()
  service_id: string;

  @IsNotEmpty()
  @IsString()
  category_id: string;
}

export class UpdateServicePayloadDto extends PartialType(
  OmitType(CreateServicePayloadDto, [] as const),
) {
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum;

  @IsOptional()
  @IsArray()
  category_ids?: string[];

  @IsOptional()
  @IsUUID(4)
  agent_category_id?: string;
}

export class UpdateServiceEntityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  other_info?: KeyPairValueDto[];

  @IsOptional()
  @IsNumber()
  view_count?: number;

  @IsOptional()
  converted_name?: string;
}

export class AddServiceToCategoryDto {
  @IsNotEmpty()
  @IsUUID(4)
  service_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  category_id: string;
}
