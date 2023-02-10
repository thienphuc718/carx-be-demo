import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  Max,
  Min,
  IsUUID,
} from 'class-validator';

export class GetListReviewDto {
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
  @Min(0)
  @ApiPropertyOptional({
    minimum: 1,
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  page: number;

  @IsOptional()
  @IsUUID(4)
  customer_id?: string;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsString()
  order_id?: string;
}

export class ReviewDto {
  @IsNotEmpty()
  @IsUUID(4)
  order_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  customer_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  agent_id: string;

  // @IsOptional()
  // @IsUUID(4)
  // product_id?: string;

  // @IsOptional()
  // @IsUUID(4)
  // service_id?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1.0)
  points: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  images: string[];
}

export class UpdateReviewDto extends PartialType(
  OmitType(ReviewDto, [
    'order_id',
    'customer_id',
    'agent_id',
    // 'product_id',
    // 'service_id',
  ] as const),
) {}
