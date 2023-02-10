import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { CreateServicePayloadDto } from '../../services/dto/ServiceDto';
import { TrailerLaterRescueResponseStatusEnum } from '../enum/TrailerLaterRescueResponseEnum';

export class TrailerLaterRescueResponseEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  trailer_rescue_request_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  agent_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  service_id: string;

  @IsOptional()
  @IsEnum(TrailerLaterRescueResponseStatusEnum)
  status?: TrailerLaterRescueResponseStatusEnum;
}

export class FilterTrailerLaterRescueResponseDto {
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

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsUUID(4)
  trailer_rescue_request_id?: string;

  @IsOptional()
  @IsEnum(TrailerLaterRescueResponseStatusEnum)
  status?: TrailerLaterRescueResponseStatusEnum
}

export class CreateTrailerLaterRescueResponseQuotationService extends OmitType(CreateServicePayloadDto, [
  'name',
  'sku',
  'status',
  'guarantee_time',
  'guarantee_time_unit',
  'is_guaranteed',
  'images',
  'other_info',
  'discount_price',
  'note',
  'category_ids',
  'description',
  'is_rescue_service',
]) {}

export class CreateTrailerLaterRescueResponseDto extends OmitType(
  TrailerLaterRescueResponseEntityDto,
  ['status', 'service_id'] as const,
) {
  @IsNotEmpty()
  trailer_later_rescue_response_service_info: CreateTrailerLaterRescueResponseQuotationService;
}

export class CreateRejectedTrailerLaterRescueResponseDto extends OmitType(
  TrailerLaterRescueResponseEntityDto,
  ['status', 'service_id'] as const,
) {}

export class UpdateTrailerLaterRescueResponseDto extends OmitType(
  TrailerLaterRescueResponseEntityDto,
  ['service_id', 'agent_id', 'trailer_rescue_request_id'] as const,
) {
  @IsNotEmpty()
  @IsEnum(TrailerLaterRescueResponseStatusEnum)
  status: TrailerLaterRescueResponseStatusEnum;
}
