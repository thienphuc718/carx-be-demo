import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FilterCustomerClubDto {
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

  @IsOptional()
  code: string;
}

export class CreateCustomerClubDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;
}

export class UpdateCustomerClubDto {
  @IsOptional()
  name: string;

  @IsOptional()
  code: string;
}
