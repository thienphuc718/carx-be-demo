import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class SectionConfigDto {
  layout: string;
  auto_play: boolean;
}

export class SectionEntityDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsBoolean()
  is_item_editable?: boolean;

  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  isnoticeable?: boolean;

  @IsOptional()
  @IsObject()
  config?: SectionConfigDto;
}

export class FilterSectionDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    title: 'Limit',
    format: 'int32',
    default: 13,
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

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsBoolean()
  @IsOptional()
  is_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isnoticeable?: boolean;
}

export class UpdateSectionDto extends OmitType(SectionEntityDto, [] as const) { }

export class UpdateSectionOrderDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  new_order: number;
}
