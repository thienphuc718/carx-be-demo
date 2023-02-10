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
import { OnsiteRescueResponseStatusEnum } from '../enum/OnsiteRescueResponseEnum';

export class OnsiteRescueResponseEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  onsite_rescue_request_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  agent_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  service_id: string;

  @IsOptional()
  @IsEnum(OnsiteRescueResponseStatusEnum)
  status?: OnsiteRescueResponseStatusEnum;
}

export class FilterOnsiteRescueResponseDto {
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
  onsite_rescue_request_id?: string;

  @IsOptional()
  @IsEnum(OnsiteRescueResponseStatusEnum)
  status?: OnsiteRescueResponseStatusEnum
}

export class CreateOnsiteRescueResponseDto extends OmitType(
  OnsiteRescueResponseEntityDto,
  ['status', 'service_id'] as const,
) {}

export class UpdateOnsiteRescueResponseDto extends OmitType(
  OnsiteRescueResponseEntityDto,
  ['service_id', 'agent_id', 'onsite_rescue_request_id'] as const,
) {
  @IsNotEmpty()
  @IsEnum(OnsiteRescueResponseStatusEnum)
  status: OnsiteRescueResponseStatusEnum;
}
