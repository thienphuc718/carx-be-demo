import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class FilterReferralLinkDto {
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

export class CreateReferralLinkDto {
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  @IsUUID(4)
  created_by: string;
}

export class UpdateReferralLinkDto {
  @IsOptional()
  link?: string;

  @IsOptional()
  @IsUUID(4)
  created_by?: string;
}
