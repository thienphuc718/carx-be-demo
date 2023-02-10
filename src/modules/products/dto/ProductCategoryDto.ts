import { PartialType, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationDto, ProductQueryOptionDto } from '.';

export class CreateProductCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;

  @IsOptional()
  parent_id: string;

  @IsNotEmpty()
  image: string;
}

export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto,
) {}

export class QueryProductByCategoryDto extends IntersectionType(
  PaginationDto,
  ProductQueryOptionDto,
) {}
