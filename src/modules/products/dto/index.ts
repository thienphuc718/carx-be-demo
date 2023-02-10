import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { OrderByEnum, OrderTypeEnum } from '../enum/ProductEnum';

export class PaginationDto {
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
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  page: number;
}

export class ProductQueryOptionDto {
  @IsOptional()
  @ApiPropertyOptional({
    default: [],
    isArray: true,
  })
  brands: string[];

  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({
    default: 0,
  })
  min_price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  max_price?: number;

  @IsOptional()
  @ApiPropertyOptional({
    default: [],
    isArray: true,
  })
  tags: string[];

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
}
