import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class RecommendedKeywordEntityDto {
  @IsNotEmpty()
  keyword: string;
}

export class FilterRecommendedKeywordDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
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

  @IsOptional()
  keyword?: string;
}

export class CreateRecommendedKeywordDto extends RecommendedKeywordEntityDto {}

export class UpdateRecommendedKeywordDto extends RecommendedKeywordEntityDto {}
