import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SystemConfigurationEntityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  apply_value: number;

  @IsNotEmpty()
  @IsString()
  apply_unit: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  compare_value: number;

  @IsNotEmpty()
  @IsString()
  compare_unit: string;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}

export class FilterSystemConfigurationDto {
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
  @IsString()
  name?: string;
}

export class CreateSystemConfigurationDto extends OmitType(
  SystemConfigurationEntityDto,
  ['compare_value', 'compare_unit', 'is_enabled'] as const,
) {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  compare_value?: number;

  @IsOptional()
  @IsString()
  compare_unit?: string;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}

export class UpdateSystemConfigurationDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  apply_value?: number;

  @IsOptional()
  @IsString()
  apply_unit?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  compare_value?: number;

  @IsOptional()
  @IsString()
  compare_unit?: string;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}
