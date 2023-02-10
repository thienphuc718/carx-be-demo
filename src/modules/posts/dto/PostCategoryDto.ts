import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsArray, IsOptional, Max, Min } from 'class-validator';

export class FilterPostCategoryDto {
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
    maximum: 10000,
    title: 'Limit',
    format: 'int32',
    default: 1,
  })
  page: number;
}

export class CreatePostCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  meta_tag_value?: string[];

  @IsOptional()
  schema_value?: string;

  @IsOptional()
  parent_id?: string;
}

export class UpdatePostCategoryDto {
  @IsOptional()
  name: string;

  @IsOptional()
  slug: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  meta_tag_value: string[];

  @IsOptional()
  schema_value: string;
}
