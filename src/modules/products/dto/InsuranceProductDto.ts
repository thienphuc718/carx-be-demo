import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsInt,
  IsNumber,
  IsBoolean,
  IsOptional,
  Max,
  Min,
  IsEnum, ValidateNested, IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { InsuranceProductCapacityUnitEnum } from '../enum/InsuranceProductEnum';

export class UpdateProductInfo {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsNumber()
  discount_price?: number;
}

export class InsuranceProductEntityDto {
  @IsNotEmpty()
  @IsString()
  usage_code: string;

  @IsNotEmpty()
  @IsString()
  car_type_code: string;

  @IsNotEmpty()
  @IsInt()
  max_insurance_time: number;

  @IsOptional()
  @IsNumber()
  insurance_amount?: number;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_voluntary?: boolean;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_combo?: boolean;

  @IsOptional()
  @IsNumber()
  combo_price?: number;

  @IsNotEmpty()
  @IsNumber()
  required_non_tax_price: number;

  @IsNotEmpty()
  @IsNumber()
  required_taxed_price: number;

  @IsNotEmpty()
  @IsInt()
  tax_percentage: number;

  @IsOptional()
  @IsNumber()
  voluntary_amount?: number;

  @IsOptional()
  @IsNumber()
  voluntary_price?: number;

  @IsOptional()
  @IsInt()
  voluntary_seats?: number;

  @IsOptional()
  @IsInt()
  capacity?: number;

  @IsNotEmpty()
  @IsEnum(InsuranceProductCapacityUnitEnum)
  capacity_unit: InsuranceProductCapacityUnitEnum;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsNotEmpty()
  @IsBoolean()
  is_business: boolean;
}

export class FilterInsuranceProductDto {
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
}

export class CreateInsuranceProductPayloadDto extends OmitType(
  InsuranceProductEntityDto,
  [] as const,
) {}

export class UpdateInsuranceProductPayloadDto {
  @IsOptional()
  @IsInt()
  max_insurance_time?: number;

  @IsOptional()
  @IsNumber()
  insurance_amount?: number;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_combo?: boolean;

  @IsOptional()
  @IsNumber()
  combo_price?: number;

  @IsOptional()
  @IsNumber()
  required_non_tax_price?: number;

  @IsOptional()
  @IsNumber()
  required_taxed_price?: number;

  @IsOptional()
  @IsInt()
  tax_percentage?: number;

  @IsOptional()
  @IsNumber()
  voluntary_amount?: number;

  @IsOptional()
  @IsNumber()
  voluntary_price?: number;

  @IsOptional()
  @IsInt()
  voluntary_seats?: number;

  @IsOptional()
  @IsInt()
  capacity?: number;

  @IsOptional()
  @IsEnum(InsuranceProductCapacityUnitEnum)
  capacity_unit?: InsuranceProductCapacityUnitEnum;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_business?: boolean;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_voluntary?: boolean;

  @ApiPropertyOptional({ type: UpdateProductInfo })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductInfo)
  product_info?: UpdateProductInfo
}

export class CreateInsuranceProductEntityDto extends CreateInsuranceProductPayloadDto {
  @IsNotEmpty()
  @IsUUID(4)
  product_id: string;
}
