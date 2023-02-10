import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FilterCustomerAgentDto {
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
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsUUID(4)
  customer_id?: string;
}

export class CustomerAgentEntityDto {
  @IsOptional()
  @IsUUID(4)
  customer_id?: string;

  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsDateString()
  created_at?: string;

  @IsOptional()
  @IsDateString()
  updated_at?: string;
}

export class CreateCustomerAgentDto extends OmitType(CustomerAgentEntityDto, [
  'created_at',
  'updated_at',
] as const) {}

export class UpdateAgentDto extends OmitType(CustomerAgentEntityDto, [
  'created_at',
  'updated_at',
] as const) {}
