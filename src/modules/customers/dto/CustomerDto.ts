import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { IsUUID } from 'sequelize-typescript';

export class FilterCustomerDto {
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
  agent_id?: string;

  @IsOptional()
  full_name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone_number?: string;

  @IsOptional()
  @Type(() => Boolean)
  is_verified?: boolean;
}

export class CustomerEntityDto {
  @IsOptional()
  user_id?: string;

  @IsOptional()
  full_name?: string;

  @IsOptional()
  first_name?: string;

  @IsOptional()
  last_name?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone_number?: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  country_code?: string;

  @IsOptional()
  city_id?: string;

  @IsOptional()
  district_id?: string;

  @IsOptional()
  customer_class_id?: string;

  @IsOptional()
  customer_club_id?: string;

  @IsOptional()
  tags?: string[];

  @IsOptional()
  @IsNumber()
  point?: number;

  @IsOptional()
  @IsNumber()
  available_points?: number;

  @IsOptional()
  converted_full_name?: string;
}

export class CreateCustomerDto extends OmitType(
  CustomerEntityDto,
  [] as const,
) {}

export class UpdateCustomerDto extends PartialType(
  OmitType(CustomerEntityDto, ['user_id'] as const),
) {}
