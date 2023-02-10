import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class ServiceCategoryRelationEntityDto {
  @IsUUID(4)
  @IsOptional()
  service_id?: string;

  @IsUUID(4)
  @IsOptional()
  category_id: string;

  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;
}

export class FilterServiceCategoryRelationDto {
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
  service_id?: string;

  @IsOptional()
  @IsUUID(4)
  category_id?: string;

  @IsOptional()
  nested_condition?: Record<string, any>;
}

export class CreateServiceCategoryRelationDto extends OmitType(
  ServiceCategoryRelationEntityDto,
  ['is_deleted'] as const,
) {}

export class UpdateServiceCategoryRelationDto extends PartialType(
  ServiceCategoryRelationEntityDto,
) {}
