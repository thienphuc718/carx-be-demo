import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { OnsiteRescueRequestStatusEnum } from '../enum/OnsiteRescueRequestEnum';

export class OnsiteRescueRequestEntityDto {
  @IsNotEmpty()
  @IsObject()
  customer_info: Record<string, any>;

  @IsNotEmpty()
  @IsObject()
  car_info: Record<string, any>;

  @IsNotEmpty()
  @IsUUID(4)
  customer_id: string;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsUUID(4)
  booking_id?: string;

  @IsNotEmpty()
  rescue_reason: string;

  @IsOptional()
  cancel_reason?: string;

  @IsOptional()
  @IsEnum(OnsiteRescueRequestStatusEnum)
  status?: OnsiteRescueRequestStatusEnum;
}

export class FilterOnsiteRescueRequestDto {
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
  customer_id?: string;

  @IsOptional()
  @IsEnum(OnsiteRescueRequestStatusEnum)
  status?: OnsiteRescueRequestStatusEnum

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;
}

export class CreateOnsiteRescueRequestDto extends OnsiteRescueRequestEntityDto {}

export class UpdateOnsiteRescueRequestDto extends OmitType(
  OnsiteRescueRequestEntityDto,
  ['customer_id', 'rescue_reason', 'car_info', 'customer_info'] as const,
) {
  @IsOptional()
  rescue_reason?: string;
}
