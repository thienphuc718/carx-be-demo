import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty, IsString,
  IsNumber, IsOptional, IsUUID, Max, Min, IsDateString, IsArray
} from 'class-validator';
import { PromotionDiscountTypeEnum, PromotionProviderEnum, PromotionStatusEnum, PromotionTypeEnum } from '../enum/PromotionEnum';
import { IsValidPromotionDate } from '../helper/PromotionDatesHelper';

export class FilterPromotionDto {
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

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(PromotionStatusEnum)
  status?: PromotionStatusEnum

  @IsOptional()
  @IsEnum(PromotionProviderEnum)
  provider?: PromotionProviderEnum;

  @IsOptional()
  @IsString()
  name?: string;
}

export class PromotionEntityDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(PromotionDiscountTypeEnum)
  discount_type: number;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(PromotionTypeEnum)
  type: number;

  @IsOptional()
  @IsUUID(4)
  gift_id?: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsNotEmpty()
  @IsValidPromotionDate()
  start_date: string;

  @IsOptional()
  @IsValidPromotionDate()
  end_date?: string;

  @IsNotEmpty()
  is_applied_all: boolean;

  @IsOptional()
  @IsNumber()
  min_value?: number;

  @IsOptional()
  @IsNumber()
  max_value?: number;

  @IsOptional()
  @IsEnum(PromotionStatusEnum)
  status?: PromotionStatusEnum

  @IsOptional()
  @IsEnum(PromotionProviderEnum)
  provider?: PromotionProviderEnum;
}

export class PromotionPayloadDto extends OmitType(PromotionEntityDto, [
  'type',
  'is_applied_all',
  'code',
  'discount_type',
  'value',
  'start_date',
  'status',
  'provider',
  'code'
] as const) {
  @IsOptional()
  @IsEnum(PromotionDiscountTypeEnum)
  discount_type?: PromotionDiscountTypeEnum;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsString()
  start_date?: string;
}

export class CreatePromotionPayloadDto extends OmitType(PromotionPayloadDto, [
  'gift_id',
  'start_date',
  'end_date',
  'discount_type',
] as const) {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(PromotionDiscountTypeEnum)
  discount_type?: PromotionDiscountTypeEnum;

  @IsNotEmpty()
  @IsValidPromotionDate()
  start_date: string;

  @IsOptional()
  @IsValidPromotionDate()
  end_date?: string;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;
}

export class UpdatePromotionPayloadDto extends PartialType(
  OmitType(CreatePromotionPayloadDto, ['agent_id'] as const),
) {
}

export class CreatePromotionEntityDto extends OmitType(PromotionEntityDto, [

] as const) {}

export class UpdatePromotionEntityDto extends PartialType(
  OmitType(CreatePromotionEntityDto, ['agent_id'] as const),
) {

}
