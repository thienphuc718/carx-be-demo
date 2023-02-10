import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  Max,
  Min,
  IsUUID,
} from 'class-validator';

export class GetListForbiddenKeywordDto {
  @Type(() => Number)
  @IsNumber()
  @Max(5000)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 5000,
    title: 'Limit',
    format: 'int32',
    default: 10,
  })
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    minimum: 1,
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  page: number;
}

export class ForbiddenKeywordDto {
  @IsNotEmpty()
  value: string;
}

export class UpdateForbiddenKeywordDto extends PartialType(
  OmitType(ForbiddenKeywordDto, [] as const),
) {}
