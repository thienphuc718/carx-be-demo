import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FilterCoinCampaignDto {
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

export class CreateCoinCampaignDto {
  @IsNotEmpty()
  @IsDate()
  start_date: string;

  @IsNotEmpty()
  @IsDate()
  end_date: string;

  @IsNotEmpty()
  @IsNumber()
  factor: number;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  object_name: string;

  @IsNotEmpty()
  @IsNumber()
  object_id: number;
}

export class UpdateCoinCampaignDto {
  @IsOptional()
  @IsDate()
  start_date?: string;

  @IsOptional()
  @IsDate()
  end_date?: string;

  @IsOptional()
  @IsNumber()
  factor?: number;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  object_name?: string;

  @IsOptional()
  @IsNumber()
  object_id?: number;
}
