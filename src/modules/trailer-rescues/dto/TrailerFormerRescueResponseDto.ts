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
import { TrailerFormerRescueResponseStatusEnum } from '../enum/TrailerFormerRescueResponseEnum';

export class TrailerFormerRescueResponseEntityDto {
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
  @IsEnum(TrailerFormerRescueResponseStatusEnum)
  status?: TrailerFormerRescueResponseStatusEnum;
}

export class FilterTrailerFormerRescueResponseDto {
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
  @IsEnum(TrailerFormerRescueResponseStatusEnum)
  status?: TrailerFormerRescueResponseStatusEnum;
}

export class CreateTrailerFormerRescueResponseDto extends OmitType(
  TrailerFormerRescueResponseEntityDto,
  ['status', 'service_id'] as const,
) {}

export class UpdateTrailerFormerRescueResponseDto extends OmitType(
  TrailerFormerRescueResponseEntityDto,
  ['service_id', 'agent_id', 'trailer_rescue_request_id'] as const,
) {
  @IsNotEmpty()
  @IsEnum(TrailerFormerRescueResponseStatusEnum)
  status: TrailerFormerRescueResponseStatusEnum;
}
