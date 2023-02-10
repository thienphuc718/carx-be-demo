import { PartialType, OmitType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductModel } from '../../../models/Products';

class ProductAttributeEntityDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsArray()
  values: ProductAttributeValueDto[];

  @IsBoolean()
  is_deleted: boolean;

  @IsString()
  created_at: string;

  @IsString()
  updated_at: string;

  @IsOptional()
  @IsArray()
  products: ProductModel[];
}

export class ProductAttributeValueDto {
  @IsString()
  code: string;

  @IsString()
  value: string;
}

export class CreateProductAttributeEntityDto extends OmitType(
  ProductAttributeEntityDto,
  ['id', 'is_deleted', 'created_at', 'updated_at', 'products'],
) {}

export class CreateProductAttributePayloadDto extends CreateProductAttributeEntityDto {}

export class UpdateProductAttributeDto extends PartialType(
  CreateProductAttributePayloadDto,
) {}

export class DeleteProductAttributeDto {
  @IsArray()
  delete_ids: string[];
}

export class DeleteProductAttributeValueDto {
  @IsArray()
  codes: string[];
}
