import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from "class-transformer";
import {
  IsNotEmpty, IsNumber, IsOptional, Max, Min,
  IsString, IsBoolean, IsDate
} from "class-validator";

export class FilterCarDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;
}

export class CarEntityDto {
  @IsString()
  id: string;

  @IsString()
  customer_id: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model_name?: string;

  @IsString()
  @IsOptional()
  model_year?: string;

  @IsString()
  @IsOptional()
  car_no?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  tire_no?: string;

  @IsString()
  @IsOptional()
  vin_no?: string;

  @IsBoolean()
  is_deleted: boolean;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}

export class CarPayloadDto extends OmitType(CarEntityDto, [
  'id',
  'customer_id',
  'is_deleted',
  'created_at',
  'updated_at'
] as const) {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  customer_id?: string;
}

export class CreateCarPayloadDto extends OmitType(CarPayloadDto, [
  'customer_id',
  'id'
] as const) {
  @IsString()
  @IsNotEmpty()
  customer_id: string;
}

export class UpdateCarPayloadDto extends PartialType(
  OmitType(CreateCarPayloadDto, ['customer_id'] as const),
) {

}
