import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FilterRoleDto {
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
  @IsString()
  name?: string;
}

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  feature_ids: string[];

  @IsUUID(4)
  company_id: string;
}

export class UpdateRoleDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  feature_ids?: string[];
}
