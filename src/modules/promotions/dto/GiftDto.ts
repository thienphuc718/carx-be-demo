import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FilterGiftDto {
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
    maximum: 10000,
    title: 'Limit',
    format: 'int32',
    default: 1,
  })
  page: number;
}

export class CreateGiftDto {
  @IsNotEmpty()
  @IsDate()
  start_date: string;

  @IsNotEmpty()
  @IsDate()
  end_date: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class UpdateGiftDto {
  @IsOptional()
  start_date: string;

  @IsOptional()
  end_date: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
