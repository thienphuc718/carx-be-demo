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

export class FilterDealDto {
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
    maximum: 10000,
    title: 'Limit',
    format: 'int32',
    default: 1,
  })
  page?: number;

  @IsOptional()
  @IsUUID(4)
  product_id?: string;

  @IsOptional()
  @IsUUID(4)
  service_id?: string;

  @IsOptional()
  @IsString()
  title?: string;
}

export class DealEntityDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsUUID(4)
  product_id: string;

  @IsOptional()
  @IsUUID(4)
  service_id: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  is_hot_deal?: boolean;
}

export class CreateDealDto extends DealEntityDto { }

export class UpdateDealDto extends PartialType(
  OmitType(DealEntityDto, [] as const),
) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsUUID(4)
  product_id?: string;

  @IsOptional()
  @IsUUID(4)
  service_id?: string;
}
