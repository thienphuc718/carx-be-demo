import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FilterCustomerCategoryDto {
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

export class CreateCustomerCategoryDto {
  @IsNotEmpty()
  name: string;
}

export class UpdateCustomerCategoryDto {
  @IsOptional()
  name: string;
}
