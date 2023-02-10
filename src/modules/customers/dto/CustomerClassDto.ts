import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FilterCustomerClassDto {
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
  limit?: number;

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
  page?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  code?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  min_point?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  max_point?: number;
}

export class CreateCustomerClassDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  min_point: number;

  @IsNotEmpty()
  max_point: number;
}

export class UpdateCustomerClassDto {
  @IsOptional()
  name: string;

  @IsOptional()
  code: string;

  @IsOptional()
  min_point: number;

  @IsOptional()
  max_point: number;
}
