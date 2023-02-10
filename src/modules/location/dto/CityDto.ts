import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FilterCityDto {
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
  name: string;
}

export class CreateCityDto {
  @IsNotEmpty()
  name: string;
}

export class UpdateCityDto {
  @IsOptional()
  name: string;
}
