import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsUUID,
  Min,
  Max,
  IsObject, ValidateNested,
} from 'class-validator';
import {
  CurrencyUnitEnum,
  ProductStatusEnum,
  ProductTypeEnum,
  ProductGuaranteeTimeUnitEnum,
} from '../enum/ProductEnum';
import { ProductAttributeValueDto } from './ProductAttributeDto';
import { UpdateProductVariantPayloadDto } from './ProductVariantDto';
import { ProductVariantModel } from '../../../models';
import { ProductCategorySelectedModel } from '../../../models';
import { ProductAttributeSelectedModel } from '../../../models';
import { PaginationDto } from '.';
import { Transform, Type } from 'class-transformer';
import { CreateInsuranceProductPayloadDto } from './InsuranceProductDto';

export class KeyPairValueDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class FilterListProductDto extends PaginationDto {
  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsString()
  name?: string | string[];

  @IsOptional()
  @IsString()
  is_top_product?: boolean;

  @IsOptional()
  @IsUUID(4)
  agent_category_id?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    title: 'min_price',
    format: 'int64',
    default: 1,
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

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_insurance_product?: boolean;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_combo?: boolean;

  @IsOptional()
  @IsArray()
  status?: ProductStatusEnum[]

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

export class FilterListProductDtoV2 extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  agent_category_ids?: string[];
}

export class ProductEntityDto {
  @IsString()
  id: string;

  @IsString()
  agent_id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_variable?: boolean;

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
  @IsEnum(ProductTypeEnum)
  type?: ProductTypeEnum;

  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  guarantee_note?: string;

  @IsOptional()
  @IsArray()
  other_info?: KeyPairValueDto[];

  @IsOptional()
  @IsArray()
  tags?: string[];

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_deleted: boolean;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_flash_buy?: boolean;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_top_product?: boolean;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsOptional()
  @IsString()
  brand_id?: string;

  @IsOptional()
  @IsArray()
  attributes?: ProductAttributeSelectedModel[];

  @IsOptional()
  @IsArray()
  variants?: ProductVariantModel[];

  @IsOptional()
  @IsArray()
  categories?: ProductCategorySelectedModel[];

  @IsOptional()
  @IsUUID(4)
  agent_category_id?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  view_count?: number;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_insurance_product?: boolean;

  @IsOptional()
  converted_name?: string;
}

export class ProductPayloadDto extends OmitType(ProductEntityDto, [
  'id',
  'agent_id',
  'is_deleted',
  'is_variable',
  'created_at',
  'updated_at',
  'name',
] as const) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsArray()
  category_ids?: string[];

  @IsOptional()
  @IsArray()
  variants?: any[];

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  discount_price?: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  agent_id?: string;

  @IsBoolean()
  @IsOptional()
  is_flash_buy?: boolean;

  @IsDate()
  created_at?: Date;

  @IsDate()
  updated_at?: Date;

  @IsOptional()
  @IsString()
  sku?: string;
}

export class CreateProductEntityDto extends OmitType(ProductEntityDto, [
  'id',
  'is_deleted',
  'created_at',
  'updated_at',
] as const) { }

export class CreateProductPayloadDto extends OmitType(ProductPayloadDto, [
  'id',
  'created_at',
  'updated_at',
  'slug',
  'categories',
  'attributes',
  'variants',
  'agent_id',
  'type',
  'tags',
  'brand_id',
  'category_ids',
  'currency_unit',
  'agent_category_id',
  'view_count',
  'converted_name',
] as const) {
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateProductPayloadDto extends PartialType(
  OmitType(CreateProductPayloadDto, ['is_flash_buy'] as const),
) {
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  @IsString()
  status?: ProductStatusEnum;
}

export class UpdateProductEntityDto extends PartialType(
  OmitType(CreateProductEntityDto, [] as const),
) {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  view_count?: number;
}

export class ProductAttributePayloadDto {
  @IsNotEmpty()
  @IsString()
  attribute_id: string;

  @IsNotEmpty()
  @IsArray()
  values: ProductAttributeValueDto[];
}

export class CreateProductAttributeSelectedEntityDto extends ProductAttributePayloadDto {
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}

export class CreateProductCategorySelectedEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  product_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  category_id: string;
}

class UpdateVariantOfProductDto extends UpdateProductVariantPayloadDto {
  @IsNotEmpty()
  @IsString()
  variant_id: string;
}

export class ProductDetailsResponseDto extends ProductEntityDto {
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  discount_price?: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  sku?: string;
}

export class CreateInsuranceProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount_price?: number;

  @IsNotEmpty()
  @IsArray()
  images: string[];

  @ApiPropertyOptional({ type: CreateInsuranceProductPayloadDto })
  @Type((() => CreateInsuranceProductPayloadDto))
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  insurance_product_info: CreateInsuranceProductPayloadDto;
}
