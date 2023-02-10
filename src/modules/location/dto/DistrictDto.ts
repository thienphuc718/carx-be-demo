import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FilterDistrictDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page: number;

  @IsOptional()
  city_id: string;

  @IsOptional()
  name: string;
}

export class CreateDistrictDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  city_id: string;
}

export class UpdateDistrictDto {
  @IsOptional()
  city_id: string;

  @IsOptional()
  name: string;
}
