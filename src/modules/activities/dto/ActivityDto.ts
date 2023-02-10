import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ActivityCodeEnum } from '../enum/ActivityEnum';

export class FilterActivityDto {
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
  @IsEnum(ActivityCodeEnum)
  code?: ActivityCodeEnum;
}

export class ActivityDataObject {
  @IsOptional()
  @IsUUID(4)
  post_id?: string;

  @IsOptional()
  @IsUUID(4)
  order_id?: string;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsUUID(4)
  customer_id?: string;

  @IsOptional()
  @IsUUID(4)
  review_id?: string;
}

export class ActivityEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  entity_id: string;

  @IsNotEmpty()
  @IsString()
  entity_name: string;

  @IsNotEmpty()
  @IsEnum(ActivityCodeEnum)
  code: ActivityCodeEnum;

  @IsNotEmpty()
  @IsUUID(4)
  user_id: string;

  @IsOptional()
  data?: ActivityDataObject;
}

export class CreateActivityDto extends OmitType(ActivityEntityDto, [] as const) {}

export class UpdateActivityDto extends PartialType(OmitType(ActivityEntityDto, [] as const)) {}