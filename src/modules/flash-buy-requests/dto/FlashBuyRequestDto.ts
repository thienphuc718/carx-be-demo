import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FilterFlashBuyRequestDto {
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
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  page?: number;

  @IsOptional()
  @IsUUID(4)
  customer_id?: string;

  @IsOptional()
  @IsString()
  product_name?: string;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_done?: boolean;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;
}

export class FlashBuyRequestEntityDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsString()
  product_image: string;

  @IsOptional()
  @IsString()
  product_description?: string;

  @IsNotEmpty()
  @IsUUID(4)
  customer_id: string;

  @IsOptional()
  @IsBoolean()
  is_done?: boolean;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;
}

export class CreateFlashBuyRequestDto extends OmitType(
  FlashBuyRequestEntityDto,
  ['is_done', 'agent_id'] as const,
) {}

export class UpdateFlashBuyRequestDto extends PartialType(
  OmitType(FlashBuyRequestEntityDto, [
    'product_name',
    'product_image',
    'customer_id',
    'product_description',
  ] as const),
) {}
