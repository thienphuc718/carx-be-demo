import { Type } from 'class-transformer';
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { ProductAttributeValueDto } from './ProductAttributeDto';

import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ProductModel } from '../../../models/Products';

class ProductVariantEntityDto {
  @IsString()
  id: string;

  @IsString()
  product_id: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsNumber()
  price: number;

  @IsNumber()
  discount_price: number;

  @IsNumber()
  quantity: number;

  @IsString()
  sku: string;

  @IsOptional()
  @IsArray()
  value?: ProductVariantValueDto[];

  @IsBoolean()
  is_top_product: boolean;

  @IsBoolean()
  is_deleted: boolean;

  @IsString()
  created_at: string;

  @IsString()
  updated_at: string;

  @IsOptional()
  product_details: ProductModel;
}

export class ProductVariantPayloadDto extends OmitType(
  ProductVariantEntityDto,
  [
    'product_id',
    'id',
    'created_at',
    'updated_at',
    'is_deleted',
    'product_details',
    'sku'
  ],
) {}

export class CreateProductVariantEntityDto extends OmitType(
  ProductVariantEntityDto,
  ['id', 'created_at', 'updated_at', 'is_deleted', 'product_details'],
) {}

export class CreateProductVariantPayloadDto extends OmitType(
  ProductVariantPayloadDto,
  [],
) {}

export class ProductVariantValueDto {
  @IsNotEmpty()
  @IsString()
  attribute_id: string;

  @IsNotEmpty()
  attribute_value: ProductAttributeValueDto;
}

export class UpdateProductVariantPayloadDto extends PartialType(
  OmitType(CreateProductVariantPayloadDto, [] as const),
) {}
