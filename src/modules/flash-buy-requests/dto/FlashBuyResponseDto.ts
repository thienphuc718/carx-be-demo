import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { CreateProductPayloadDto } from '../../products/dto/ProductDto';
import { FlashBuyResponseStatusEnum } from '../enum/FlashBuyResponseEnum';

export class FilterFlashBuyResponseDto {
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
  flash_buy_request_id?: string;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsUUID(4)
  product_id?: string;

  @IsOptional()
  @IsEnum(FlashBuyResponseStatusEnum)
  status?: FlashBuyResponseStatusEnum;
}

export class FlashBuyResponseEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  flash_buy_request_id: string;

  @IsOptional()
  @IsUUID(4)
  product_id?: string;

  @IsNotEmpty()
  @IsUUID(4)
  agent_id: string;

  @IsNotEmpty()
  @IsEnum(FlashBuyResponseStatusEnum)
  status: FlashBuyResponseStatusEnum;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}

export class CreateFlashBuyResponseDto extends OmitType(
  FlashBuyResponseEntityDto,
  ['is_deleted', 'product_id', 'status'] as const,
) {
  @IsNotEmpty()
  flash_buy_product_info: CreateProductPayloadDto;
}

export class CreateRejectedFlashBuyResponse extends OmitType(
  FlashBuyResponseEntityDto,
  ['is_deleted', 'product_id', 'status'] as const,
) {}

export class UpdateFlashBuyResponseDto extends PartialType(
  OmitType(FlashBuyResponseEntityDto, [] as const),
) {}

export class UpdateFlashBuyResponseConditionDto {
  @IsNotEmpty()
  @IsUUID(4)
  agent_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  flash_buy_request_id: string;

  @IsOptional()
  @IsUUID(4)
  product_id?: string;
}
