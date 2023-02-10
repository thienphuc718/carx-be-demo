import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FilterServiceCategoryDto {
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

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  show_on_homepage?: boolean;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;
}

export class ServiceCategoryEntityDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @IsOptional()
  @IsBoolean()
  show_on_homepage?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}

export class CreateServiceCategoryDto extends OmitType(
  ServiceCategoryEntityDto,
  ['id', 'is_deleted', 'show_on_homepage', 'order', 'slug'] as const,
) {}

export class UpdateServiceCategoryDto extends PartialType(
  OmitType(ServiceCategoryEntityDto, [
    'id',
    'created_at',
    'updated_at',
  ] as const),
) {}
