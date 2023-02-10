import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Max,
  Min,
  IsString,
} from 'class-validator';

export class FilterCompanyDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;
}

export class KeyPairValueDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class CreateCompanyDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  tax_id?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  phone_number?: string;

  @IsOptional()
  size?: string;

  @IsOptional()
  @IsArray()
  license?: string[];

  @IsOptional()
  @IsArray()
  other_info?: KeyPairValueDto[];
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsArray()
  license?: string[];

  @IsOptional()
  @IsArray()
  other_info?: KeyPairValueDto[];
}
